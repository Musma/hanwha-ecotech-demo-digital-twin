import { DEFAULT_GRID_SIZE_METERS } from '@/shared/constants/map-common'
import {
  YARD_GRID_BOUNDARY_COORDINATES,
  YARD_GRID_BOUNDARY_ROTATION_DEG,
} from '@/shared/constants/map-yard'
import type { LatLng, LocalPoint } from '@/shared/helpers/map/grid-utils'
import {
  convertLocalPolyPointToLngLat,
  normalizeGridBoundaryCoordinates,
  parseLocalPolyString,
} from '@/shared/helpers/map/map-geo-helpers'
import type { PolygonShape } from '@/shared/helpers/map/measurement-utils'

export interface YardJibunPolygonSource {
  id: number
  abbr?: string
  name?: string
  level: number
  parent?: number | null
  poly?: string | null
}

export interface YardRoadJibunPolygonSource {
  id: string
  cellRanges?: YardRoadJibunCellRange[]
  name?: string
  poly?: string | null
}

export interface YardRoadJibunRowCellRange {
  axis: 'row'
  from: number
  row: number
  to: number
}

export interface YardRoadJibunColumnCellRange {
  axis: 'column'
  column: number
  from: number
  to: number
}

export type YardRoadJibunCellRange =
  YardRoadJibunColumnCellRange | YardRoadJibunRowCellRange

interface RoadGridCell {
  column: number
  row: number
}

interface RoadGridVertex {
  column: number
  row: number
}

interface RoadGridEdge {
  from: RoadGridVertex
  to: RoadGridVertex
}

interface YardJibunLayoutItem {
  id: number
  parent?: number | null
  displayPrefix: string
  displayKind: string
  suffixNumber: number
  suffixWidth: number
  minX: number
  maxX: number
  minY: number
  maxY: number
}

const JIBUN_SUFFIX_PATTERN = /^(.*-)([A-Za-z]+)(\d+)$/
const SAME_ROW_OVERLAP_RATIO = 0.35
const ORIGINAL_ORDER_PARENT_ABBRS = new Set(['E1'])
const REVERSED_ORDER_PARENT_ABBRS = new Set(['NI'])
const REVERSED_MIXED_SUFFIX_GROUP_KEYS = new Set(['01:02-'])
const ORIGINAL_ORDER_YARD_ABBRS = new Set(['2Y'])

export function cloneYardGridBoundaryCoordinates(): number[][] {
  if (
    !Array.isArray(YARD_GRID_BOUNDARY_COORDINATES) ||
    YARD_GRID_BOUNDARY_COORDINATES.length < 4
  ) {
    return []
  }
  return YARD_GRID_BOUNDARY_COORDINATES.map((coord) => [...coord])
}

export function normalizeYardGridBoundaryCoordinates(
  coordinates: number[][],
  origin: LatLng,
): number[][] {
  return normalizeGridBoundaryCoordinates(
    coordinates,
    origin,
    YARD_GRID_BOUNDARY_ROTATION_DEG,
  )
}

export function getYardJibunKindByLevel(
  level: number,
): 'dae' | 'jung' | 'so' | null {
  if (level === 2) return 'dae'
  if (level === 3) return 'jung'
  if (level === 4) return 'so'
  return null
}

function createLayoutItem(
  jibun: YardJibunPolygonSource,
  localPoints: LocalPoint[],
): YardJibunLayoutItem | null {
  const match = JIBUN_SUFFIX_PATTERN.exec(jibun.abbr ?? '')
  if (!match || localPoints.length < 3) return null

  const [, displayPrefix, displayKind, suffix] = match
  const xs = localPoints.map((point) => point.x)
  const ys = localPoints.map((point) => point.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  return {
    id: jibun.id,
    parent: jibun.parent,
    displayPrefix,
    displayKind,
    suffixNumber: Number(suffix),
    suffixWidth: suffix.length,
    minX,
    maxX,
    minY,
    maxY,
  }
}

function localPointRowsOverlap(
  row: YardJibunLayoutItem[],
  item: YardJibunLayoutItem,
): boolean {
  const rowMinY = Math.min(...row.map((rowItem) => rowItem.minY))
  const rowMaxY = Math.max(...row.map((rowItem) => rowItem.maxY))
  const overlap = Math.min(rowMaxY, item.maxY) - Math.max(rowMinY, item.minY)
  if (overlap <= 0) return false

  const rowHeight = rowMaxY - rowMinY
  const itemHeight = item.maxY - item.minY
  return overlap >= Math.min(rowHeight, itemHeight) * SAME_ROW_OVERLAP_RATIO
}

function createJibunLayoutRows(
  items: YardJibunLayoutItem[],
): YardJibunLayoutItem[][] {
  const rows: YardJibunLayoutItem[][] = []

  for (const item of [...items].sort((a, b) => a.minY - b.minY)) {
    const row = rows.find((candidate) => localPointRowsOverlap(candidate, item))
    if (row) {
      row.push(item)
    } else {
      rows.push([item])
    }
  }

  return rows
}

function getRowMinY(row: YardJibunLayoutItem[]): number {
  return Math.min(...row.map((item) => item.minY))
}

function isMixedJibunLayout(rows: YardJibunLayoutItem[][]): boolean {
  return rows.length > 1 && rows.some((row) => row.length > 1)
}

function shouldKeepOriginalOrder(
  items: YardJibunLayoutItem[],
  jibunById: Map<number, YardJibunPolygonSource>,
): boolean {
  const parentId = items[0]?.parent
  if (parentId == null) return false

  const parent = jibunById.get(parentId)
  if (ORIGINAL_ORDER_PARENT_ABBRS.has(parent?.abbr ?? '')) return true
  if (REVERSED_ORDER_PARENT_ABBRS.has(parent?.abbr ?? '')) return false

  const yard = parent?.parent == null ? null : jibunById.get(parent.parent)
  return ORIGINAL_ORDER_YARD_ABBRS.has(yard?.abbr ?? '')
}

function sortJibunLayoutItems(
  rows: YardJibunLayoutItem[][],
  direction: 'ascending' | 'descending',
): YardJibunLayoutItem[] {
  const sortedRows = [...rows].sort((a, b) =>
    direction === 'ascending'
      ? getRowMinY(b) - getRowMinY(a)
      : getRowMinY(a) - getRowMinY(b),
  )

  return sortedRows.flatMap((row) => row.sort((a, b) => a.minX - b.minX))
}

function shouldReverseMixedSuffixOrder(
  items: YardJibunLayoutItem[],
  jibunById: Map<number, YardJibunPolygonSource>,
): boolean {
  const parentId = items[0]?.parent
  if (parentId == null) return false

  const parent = jibunById.get(parentId)
  return REVERSED_MIXED_SUFFIX_GROUP_KEYS.has(
    `${parent?.abbr ?? ''}:${items[0]?.displayPrefix ?? ''}`,
  )
}

function createDisplayNameById(
  jibuns: YardJibunPolygonSource[],
): Map<number, string> {
  const jibunById = new Map(jibuns.map((jibun) => [jibun.id, jibun]))
  const groups = new Map<string, YardJibunLayoutItem[]>()

  for (const jibun of jibuns) {
    const localPoints = parseLocalPolyString(jibun.poly)
    const item = createLayoutItem(jibun, localPoints)
    if (!item) continue

    const key = [
      jibun.parent ?? 'root',
      item.displayPrefix,
      item.displayKind,
    ].join(':')
    groups.set(key, [...(groups.get(key) ?? []), item])
  }

  const displayNameById = new Map<number, string>()

  for (const items of groups.values()) {
    if (items.length < 2) continue
    if (shouldKeepOriginalOrder(items, jibunById)) continue

    const rows = createJibunLayoutRows(items)
    const mixedLayout = isMixedJibunLayout(rows)
    const suffixNumbers = [...items].map((item) => item.suffixNumber)
    if (mixedLayout && shouldReverseMixedSuffixOrder(items, jibunById)) {
      suffixNumbers.sort((a, b) => a - b)
      suffixNumbers.splice(
        1,
        suffixNumbers.length - 1,
        ...suffixNumbers.slice(1).reverse(),
      )
    } else {
      suffixNumbers.sort((a, b) => (mixedLayout ? a - b : b - a))
    }
    const sortedItems = sortJibunLayoutItems(
      rows,
      mixedLayout ? 'ascending' : 'descending',
    )

    for (const [index, item] of sortedItems.entries()) {
      const suffixNumber = suffixNumbers[index]
      if (!Number.isFinite(suffixNumber)) continue
      displayNameById.set(
        item.id,
        `${item.displayPrefix}${item.displayKind}${String(
          suffixNumber,
        ).padStart(item.suffixWidth, '0')}`,
      )
    }
  }

  return displayNameById
}

function getRoadGridCellKey(cell: RoadGridCell): string {
  return `${cell.row}:${cell.column}`
}

function getRoadGridVertexKey(vertex: RoadGridVertex): string {
  return `${vertex.column}:${vertex.row}`
}

function getRoadGridEdgeKey(edge: RoadGridEdge): string {
  return `${getRoadGridVertexKey(edge.from)}>${getRoadGridVertexKey(edge.to)}`
}

function createRoadGridCell(row: number, column: number): RoadGridCell | null {
  const safeRow = Math.trunc(row)
  const safeColumn = Math.trunc(column)
  if (!Number.isFinite(safeRow) || !Number.isFinite(safeColumn)) return null
  return { column: safeColumn, row: safeRow }
}

function expandRoadJibunCellRange(
  range: YardRoadJibunCellRange,
): RoadGridCell[] {
  const from = Math.trunc(Math.min(range.from, range.to))
  const to = Math.trunc(Math.max(range.from, range.to))
  if (!Number.isFinite(from) || !Number.isFinite(to)) return []

  const cells: RoadGridCell[] = []
  if (range.axis === 'row') {
    for (let column = from; column <= to; column += 1) {
      const cell = createRoadGridCell(range.row, column)
      if (cell) cells.push(cell)
    }
    return cells
  }

  for (let row = from; row <= to; row += 1) {
    const cell = createRoadGridCell(row, range.column)
    if (cell) cells.push(cell)
  }
  return cells
}

function getRoadJibunCells(road: YardRoadJibunPolygonSource): RoadGridCell[] {
  return (road.cellRanges ?? []).flatMap((range) =>
    expandRoadJibunCellRange(range),
  )
}

function createRoadGridCellMap(
  roads: YardRoadJibunPolygonSource[],
): Map<string, RoadGridCell> {
  const cells = new Map<string, RoadGridCell>()

  for (const road of roads) {
    for (const cell of getRoadJibunCells(road)) {
      cells.set(getRoadGridCellKey(cell), cell)
    }
  }

  return cells
}

function createRoadGridCellComponents(
  cellMap: Map<string, RoadGridCell>,
): RoadGridCell[][] {
  const remaining = new Set(cellMap.keys())
  const components: RoadGridCell[][] = []

  for (const startKey of cellMap.keys()) {
    if (!remaining.has(startKey)) continue

    const component: RoadGridCell[] = []
    const queue: RoadGridCell[] = [cellMap.get(startKey)!]
    remaining.delete(startKey)

    for (let index = 0; index < queue.length; index += 1) {
      const cell = queue[index]
      component.push(cell)

      const neighbors: RoadGridCell[] = [
        { column: cell.column, row: cell.row - 1 },
        { column: cell.column + 1, row: cell.row },
        { column: cell.column, row: cell.row + 1 },
        { column: cell.column - 1, row: cell.row },
      ]

      for (const neighbor of neighbors) {
        const key = getRoadGridCellKey(neighbor)
        const nextCell = cellMap.get(key)
        if (!nextCell || !remaining.has(key)) continue
        remaining.delete(key)
        queue.push(nextCell)
      }
    }

    components.push(component)
  }

  return components
}

function createRoadGridBoundaryEdges(cells: RoadGridCell[]): RoadGridEdge[] {
  const cellKeys = new Set(cells.map((cell) => getRoadGridCellKey(cell)))
  const hasCell = (row: number, column: number) =>
    cellKeys.has(getRoadGridCellKey({ column, row }))
  const edges: RoadGridEdge[] = []

  for (const cell of cells) {
    const { column, row } = cell
    if (!hasCell(row - 1, column)) {
      edges.push({
        from: { column, row },
        to: { column: column + 1, row },
      })
    }
    if (!hasCell(row, column + 1)) {
      edges.push({
        from: { column: column + 1, row },
        to: { column: column + 1, row: row + 1 },
      })
    }
    if (!hasCell(row + 1, column)) {
      edges.push({
        from: { column: column + 1, row: row + 1 },
        to: { column, row: row + 1 },
      })
    }
    if (!hasCell(row, column - 1)) {
      edges.push({
        from: { column, row: row + 1 },
        to: { column, row },
      })
    }
  }

  return edges
}

function getRoadGridEdgeDirection(edge: RoadGridEdge): RoadGridVertex {
  return {
    column: edge.to.column - edge.from.column,
    row: edge.to.row - edge.from.row,
  }
}

function getRoadGridTurnScore(
  current: RoadGridEdge,
  candidate: RoadGridEdge,
): number {
  const currentDirection = getRoadGridEdgeDirection(current)
  const candidateDirection = getRoadGridEdgeDirection(candidate)
  const cross =
    currentDirection.column * candidateDirection.row -
    currentDirection.row * candidateDirection.column
  const dot =
    currentDirection.column * candidateDirection.column +
    currentDirection.row * candidateDirection.row

  if (cross > 0) return 0
  if (dot > 0) return 1
  if (cross < 0) return 2
  return 3
}

function getNextRoadGridBoundaryEdge(
  current: RoadGridEdge,
  candidates: RoadGridEdge[],
): RoadGridEdge | null {
  if (!candidates.length) return null
  return [...candidates].sort((a, b) => {
    const scoreDiff =
      getRoadGridTurnScore(current, a) - getRoadGridTurnScore(current, b)
    if (scoreDiff) return scoreDiff
    return getRoadGridEdgeKey(a).localeCompare(getRoadGridEdgeKey(b))
  })[0]
}

function createRoadGridBoundaryRings(
  cells: RoadGridCell[],
): RoadGridVertex[][] {
  const edges = createRoadGridBoundaryEdges(cells)
  const edgesByStart = new Map<string, RoadGridEdge[]>()
  for (const edge of edges) {
    const key = getRoadGridVertexKey(edge.from)
    edgesByStart.set(key, [...(edgesByStart.get(key) ?? []), edge])
  }

  const visitedEdgeKeys = new Set<string>()
  const rings: RoadGridVertex[][] = []
  const maxSteps = edges.length + 1

  for (const firstEdge of edges) {
    if (visitedEdgeKeys.has(getRoadGridEdgeKey(firstEdge))) continue

    const ring: RoadGridVertex[] = [firstEdge.from]
    let currentEdge: RoadGridEdge | null = firstEdge

    for (let step = 0; currentEdge && step < maxSteps; step += 1) {
      visitedEdgeKeys.add(getRoadGridEdgeKey(currentEdge))
      ring.push(currentEdge.to)

      const isClosed =
        getRoadGridVertexKey(currentEdge.to) === getRoadGridVertexKey(ring[0])
      if (isClosed) break

      const nextCandidates = (
        edgesByStart.get(getRoadGridVertexKey(currentEdge.to)) ?? []
      ).filter((edge) => !visitedEdgeKeys.has(getRoadGridEdgeKey(edge)))
      currentEdge = getNextRoadGridBoundaryEdge(currentEdge, nextCandidates)
    }

    const lastVertex = ring[ring.length - 1]
    const isClosed =
      lastVertex &&
      getRoadGridVertexKey(lastVertex) === getRoadGridVertexKey(ring[0])
    if (isClosed && ring.length >= 4) rings.push(ring.slice(0, -1))
  }

  return rings
}

function convertRoadGridRingToPolygon(
  ring: RoadGridVertex[],
  index: number,
  boundaryCoordinates: number[][],
  origin: LatLng,
): PolygonShape | null {
  const points = ring
    .map((vertex) =>
      convertLocalPolyPointToLngLat(
        {
          x: vertex.row * DEFAULT_GRID_SIZE_METERS,
          y: vertex.column * DEFAULT_GRID_SIZE_METERS,
        },
        boundaryCoordinates,
        origin,
      ),
    )
    .filter((point): point is LatLng => Boolean(point))

  if (points.length < 3) return null

  return {
    id: `road-jibun-connected-${String(index + 1).padStart(3, '0')}`,
    name: `도로지번 연결 ${index + 1}`,
    points,
  }
}

function createConnectedRoadJibunPolygons(
  roads: YardRoadJibunPolygonSource[],
  boundaryCoordinates: number[][],
  origin: LatLng,
): PolygonShape[] {
  const cellMap = createRoadGridCellMap(roads)
  if (!cellMap.size) return []

  return createRoadGridCellComponents(cellMap)
    .sort((a, b) => {
      const aMinRow = Math.min(...a.map((cell) => cell.row))
      const bMinRow = Math.min(...b.map((cell) => cell.row))
      if (aMinRow !== bMinRow) return aMinRow - bMinRow
      const aMinColumn = Math.min(...a.map((cell) => cell.column))
      const bMinColumn = Math.min(...b.map((cell) => cell.column))
      return aMinColumn - bMinColumn
    })
    .flatMap((cells) => createRoadGridBoundaryRings(cells))
    .map((ring, index) =>
      convertRoadGridRingToPolygon(ring, index, boundaryCoordinates, origin),
    )
    .filter((polygon): polygon is PolygonShape => Boolean(polygon))
}

function createRoadJibunPolygonsFromLocalPolys(
  roads: YardRoadJibunPolygonSource[],
  boundaryCoordinates: number[][],
  origin: LatLng,
): PolygonShape[] {
  return roads
    .map((road) => {
      const points = parseLocalPolyString(road.poly)
        .map((point) =>
          convertLocalPolyPointToLngLat(point, boundaryCoordinates, origin),
        )
        .filter((point): point is LatLng => Boolean(point))
      if (points.length < 3) return null

      return {
        id: `road-jibun-${road.id}`,
        name: road.name ?? road.id,
        points,
      } as PolygonShape
    })
    .filter((polygon): polygon is PolygonShape => Boolean(polygon))
}

export function createYardJibunPolygons(
  jibuns: YardJibunPolygonSource[],
  origin: LatLng,
): PolygonShape[] {
  const boundaryCoordinates = normalizeYardGridBoundaryCoordinates(
    cloneYardGridBoundaryCoordinates(),
    origin,
  )
  const normalizedJibuns = Array.isArray(jibuns) ? jibuns : []
  const displayNameById = createDisplayNameById(normalizedJibuns)
  return normalizedJibuns
    .map((jibun) => {
      const jibunKind: string | null =
        getYardJibunKindByLevel(jibun.level) ??
        (jibun.level === 1 ? 'yard' : null)
      const localPoints = parseLocalPolyString(jibun.poly)
      if (!jibunKind || localPoints.length < 3) return null
      const points = localPoints
        .map((point) =>
          convertLocalPolyPointToLngLat(point, boundaryCoordinates, origin),
        )
        .filter((point): point is LatLng => Boolean(point))
      if (points.length < 3) return null
      return {
        id: `jibun-${jibun.id}`,
        name:
          displayNameById.get(jibun.id) ||
          jibun.abbr ||
          jibun.name ||
          String(jibun.id),
        points,
        colorKey: jibunKind,
      } as PolygonShape
    })
    .filter((polygon): polygon is PolygonShape => Boolean(polygon))
}

export function createYardRoadJibunPolygons(
  roads: YardRoadJibunPolygonSource[],
  origin: LatLng,
): PolygonShape[] {
  const boundaryCoordinates = normalizeYardGridBoundaryCoordinates(
    cloneYardGridBoundaryCoordinates(),
    origin,
  )
  const normalizedRoads = Array.isArray(roads) ? roads : []
  const connectedRoads = createConnectedRoadJibunPolygons(
    normalizedRoads,
    boundaryCoordinates,
    origin,
  )

  if (connectedRoads.length) return connectedRoads

  return createRoadJibunPolygonsFromLocalPolys(
    normalizedRoads,
    boundaryCoordinates,
    origin,
  )
}
