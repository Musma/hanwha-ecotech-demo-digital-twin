<script setup lang="ts">
import maplibregl, {
  type GeoJSONSource,
  type LngLatBoundsLike,
  type Map as MapLibreMap,
  type MapMouseEvent,
  type Marker,
} from 'maplibre-gl'
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'

import 'maplibre-gl/dist/maplibre-gl.css'

import type { LogisticsTwinPendingLocation } from '@/features/logged/tablet/constants/logistics-twin-data'
import { createDashboardMapMarkerInfoElement } from '@/features/logged/tablet/utils/map-marker-info'
import {
  startVehicleRouteAnimation,
  type VehicleRouteAnimationPhase,
} from '@/features/logged/tablet/utils/vehicle-route-animation'
import {
  WORK_TRACK_BASE_DASH_ARRAY,
  WORK_TRACK_FLOW_LAYER_ID,
  WORK_TRACK_INITIAL_FLOW_GRADIENT,
  startWorkTrackAnimation,
} from '@/features/logged/tablet/utils/work-track-animation'
import { getMapLibreStyle } from '@/shared/constants/map'
import { DEFAULT_GRID_SIZE_METERS } from '@/shared/constants/map-common'
import {
  YARD_DEFAULT_BEARING,
  YARD_DEFAULT_CENTER,
  YARD_DEFAULT_GRID_ROTATION,
  YARD_GRID_BOUNDARY_COORDINATES,
  YARD_GRID_BOUNDARY_ROTATION_DEG,
  YARD_JIBUN_KIND_COLORS,
} from '@/shared/constants/map-yard'
import {
  buildGridGeoJson,
  type LatLng,
  type LocalPoint,
} from '@/shared/helpers/map/grid-utils'
import { collapseMapAttribution } from '@/shared/helpers/map/map-control-utils'
import {
  convertLngLatToLocalPolyPoint,
  isPointInsidePolygon,
  normalizeGridBoundaryCoordinates,
} from '@/shared/helpers/map/map-geo-helpers'
import {
  getPhysicalGridAddress,
  getPhysicalGridCellCenter,
} from '@/shared/helpers/map/physical-address'
import type {
  MapEntityMarkerItem,
  YardMapProps,
} from '@/shared/types/map/yard-map'

import type { FeatureCollection, Geometry } from 'geojson'

type DashboardGeoJsonFeatureCollection = FeatureCollection<
  Geometry,
  Record<string, unknown>
>

interface LivePosition {
  lng: number
  lat: number
  label?: string
}

interface Props {
  gridVisible?: boolean
  mapStyle: string
  mapMarkers?: MapEntityMarkerItem[]
  polygons?: YardMapProps['polygons']
  /** 실시간 현재 위치(WGS84). null이면 마커를 표시하지 않는다. */
  livePosition?: LivePosition | null
  /** 작업 종료 후 보정된 트랙 좌표([lng, lat]). 비어 있으면 궤적선을 표시하지 않는다. */
  trackCoordinates?: Array<[number, number]>
  /** true이면 이동 경로 위에 방향성 애니메이션을 표시한다. */
  trackAnimated?: boolean
  /** true이면 지도 클릭 좌표를 물리지번으로 변환해 전달한다. */
  pickMode?: boolean
  /** true이면 도로 폴리곤 임시 작성 패널을 표시한다. */
  roadPolygonToolVisible?: boolean
  /** 값이 증가하면 지도를 초기 카메라 위치로 되돌린다. */
  viewResetRequest?: number
}

const props = withDefaults(defineProps<Props>(), {
  gridVisible: false,
  mapMarkers: () => [],
  polygons: () => [],
  livePosition: null,
  trackCoordinates: () => [],
  trackAnimated: false,
  pickMode: false,
  roadPolygonToolVisible: false,
  viewResetRequest: 0,
})

const emit = defineEmits<{
  closeMarkerInfo: [id: string]
  pickLocation: [location: LogisticsTwinPendingLocation]
  selectMarker: [id: string]
}>()

const MAP_VIEW_COORDINATES: [
  [number, number],
  [number, number],
  [number, number],
  [number, number],
] = [
  [127.587555, 34.899999],
  [127.600754, 34.908457],
  [127.605362, 34.90362],
  [127.592163, 34.895162],
]

const FIT_BOUNDS_PADDING = 20
const WORK_TRACK_FIT_BOUNDS_PADDING = {
  top: 48,
  right: 48,
  bottom: 48,
  // 이동 요청 패널(360px)과 패널의 좌측 여백(16px) 뒤에서 경로가 보이도록 한다.
  left: 424,
}
const INITIAL_ZOOM_OFFSET = 1
const SELECTED_MARKER_FOCUS_ZOOM_INCREMENT = 1
const SELECTED_MARKER_MAX_FOCUS_ZOOM = 17
const SELECTED_MARKER_FOCUS_DURATION_MS = 650
const SELECTED_MARKER_FOCUS_OFFSET: [number, number] = [0, 100]
const YARD_GRID_SOURCE_ID = 'dashboard-yard-grid'
const YARD_GRID_LAYER_ID = 'dashboard-yard-grid'
const JIBUN_POLYGON_SOURCE_ID = 'dashboard-jibun-polygons'
const JIBUN_POLYGON_FILL_LAYER_ID = 'dashboard-jibun-polygon-fill'
const JIBUN_POLYGON_LINE_LAYER_ID = 'dashboard-jibun-polygon-line'
const ROAD_POLYGON_DRAW_SOURCE_ID = 'dashboard-road-polygon-draw'
const ROAD_POLYGON_DRAW_FILL_LAYER_ID = 'dashboard-road-polygon-draw-fill'
const ROAD_POLYGON_DRAW_LINE_LAYER_ID = 'dashboard-road-polygon-draw-line'
const ROAD_POLYGON_DRAW_POINT_LAYER_ID = 'dashboard-road-polygon-draw-point'
const WORK_TRACK_SOURCE_ID = 'dashboard-work-track'
const WORK_TRACK_LAYER_ID = 'dashboard-work-track'
const ROAD_POLYGON_GRID_SCAN_PADDING = 1
const ROAD_POLYGON_VISIBLE_CELL_LIMIT = 36

const YARD_GRID_ORIGIN = {
  lat: YARD_DEFAULT_CENTER[1],
  lng: YARD_DEFAULT_CENTER[0],
}

const YARD_GRID_BOUNDARY = normalizeGridBoundaryCoordinates(
  YARD_GRID_BOUNDARY_COORDINATES,
  YARD_GRID_ORIGIN,
  YARD_GRID_BOUNDARY_ROTATION_DEG,
)

function updatePickModeCursor() {
  const map = mapRef.value
  if (!map) return
  map.getCanvas().style.cursor =
    props.pickMode || roadPolygonDrawActive.value ? 'crosshair' : ''
}

function resetMapView() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  const initialCamera = initialCameraRef.value
  if (!initialCamera) {
    map.fitBounds(mapBounds.value, {
      bearing: YARD_DEFAULT_BEARING,
      padding: FIT_BOUNDS_PADDING,
      duration: 600,
    })
    return
  }

  map.easeTo({
    bearing: YARD_DEFAULT_BEARING,
    center: initialCamera.center,
    duration: 600,
    pitch: 0,
    zoom: initialCamera.zoom,
  })
}

function handleLocationPick(event: MapMouseEvent) {
  if (!props.pickMode) return

  const label = getPhysicalGridAddress(
    event.lngLat,
    YARD_GRID_ORIGIN,
    DEFAULT_GRID_SIZE_METERS,
    DEFAULT_GRID_SIZE_METERS,
    YARD_GRID_BOUNDARY,
  )
  const matched = /^\((\d+),\s*(\d+)\)$/.exec(label)
  if (!matched) return

  const phys: [number, number] = [Number(matched[1]), Number(matched[2])]
  emit('pickLocation', {
    label,
    phys,
    lngLat: [event.lngLat.lng, event.lngLat.lat],
  })
}

function handleRoadPolygonDrawClick(event: MapMouseEvent) {
  if (!roadPolygonDrawActive.value) return false

  event.originalEvent.preventDefault()
  roadPolygonPoints.value = [
    ...roadPolygonPoints.value,
    { lat: event.lngLat.lat, lng: event.lngLat.lng },
  ]
  return true
}

function handleMapClick(event: MapMouseEvent) {
  if (handleRoadPolygonDrawClick(event)) return
  handleLocationPick(event)
}

function createGridFeatureCollection(): DashboardGeoJsonFeatureCollection {
  const corners = YARD_GRID_BOUNDARY.map(([lng, lat]) => ({ lat, lng }))
  const { data } = buildGridGeoJson({
    corners,
    origin: YARD_GRID_ORIGIN,
    gridWidth: DEFAULT_GRID_SIZE_METERS,
    gridHeight: DEFAULT_GRID_SIZE_METERS,
    rotationDeg: YARD_DEFAULT_GRID_ROTATION,
    maskPolygons: YARD_GRID_BOUNDARY.length >= 4 ? [YARD_GRID_BOUNDARY] : [],
  })
  return data as DashboardGeoJsonFeatureCollection
}

const mapRootRef = shallowRef<HTMLDivElement | null>(null)
const mapRef = shallowRef<MapLibreMap | null>(null)
const markerRefs = shallowRef<Marker[]>([])
const labelMarkerRefs = shallowRef<Marker[]>([])
const liveMarkerRef = shallowRef<Marker | null>(null)
const roadPolygonDrawActive = ref(false)
const roadPolygonPoints = ref<LatLng[]>([])
const roadPolygonCopyStatus = ref('')
const mapLoaded = shallowRef(false)
const initialCameraRef = shallowRef<{
  center: [number, number]
  zoom: number
} | null>(null)
let stopWorkTrackAnimation: (() => void) | null = null
let stopMarkerAnimations: Array<() => void> = []
let roadPolygonCopyStatusTimer: number | null = null

const mapBounds = computed<LngLatBoundsLike>(() => {
  const lngs = MAP_VIEW_COORDINATES.map(([lng]) => lng)
  const lats = MAP_VIEW_COORDINATES.map(([, lat]) => lat)
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ]
})

function createEmptyFeatureCollection(): DashboardGeoJsonFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [],
  }
}

function parsePhysicalGridLabel(label: string): [number, number] | null {
  const matched = /^\((\d+),\s*(\d+)\)$/.exec(label)
  if (!matched) return null
  return [Number(matched[1]), Number(matched[2])]
}

function formatPhysicalGridLabel(phys: [number, number]) {
  return `(${String(phys[0]).padStart(3, '0')}, ${String(phys[1]).padStart(3, '0')})`
}

function formatRoadPolygonLocalNumber(value: number) {
  return Number(value.toFixed(1)).toString()
}

const roadPolygonVertexLabels = computed(() =>
  roadPolygonPoints.value
    .map((point) =>
      getPhysicalGridAddress(
        point,
        YARD_GRID_ORIGIN,
        DEFAULT_GRID_SIZE_METERS,
        DEFAULT_GRID_SIZE_METERS,
        YARD_GRID_BOUNDARY,
      ),
    )
    .filter(Boolean),
)

const roadPolygonLocalPolyText = computed(() =>
  roadPolygonPoints.value
    .map((point) =>
      convertLngLatToLocalPolyPoint(
        point,
        YARD_GRID_BOUNDARY,
        YARD_GRID_ORIGIN,
      ),
    )
    .filter((point): point is LocalPoint => Boolean(point))
    .map(
      (point) =>
        `(${formatRoadPolygonLocalNumber(point.x)},${formatRoadPolygonLocalNumber(point.y)})`,
    )
    .join(''),
)

const roadPolygonMatchedGridCells = computed(() => {
  if (roadPolygonPoints.value.length < 3) return []

  const vertexPhys = roadPolygonVertexLabels.value
    .map(parsePhysicalGridLabel)
    .filter((phys): phys is [number, number] => Boolean(phys))
  if (vertexPhys.length === 0) return []

  const cols = vertexPhys.map(([col]) => col)
  const rows = vertexPhys.map(([, row]) => row)
  const minCol = Math.max(0, Math.min(...cols) - ROAD_POLYGON_GRID_SCAN_PADDING)
  const maxCol = Math.max(...cols) + ROAD_POLYGON_GRID_SCAN_PADDING
  const minRow = Math.max(0, Math.min(...rows) - ROAD_POLYGON_GRID_SCAN_PADDING)
  const maxRow = Math.max(...rows) + ROAD_POLYGON_GRID_SCAN_PADDING
  const cells: Array<{ label: string; phys: [number, number] }> = []

  for (let row = minRow; row <= maxRow; row += 1) {
    for (let col = minCol; col <= maxCol; col += 1) {
      const phys: [number, number] = [col, row]
      const center = getPhysicalGridCellCenter(
        phys,
        YARD_GRID_ORIGIN,
        DEFAULT_GRID_SIZE_METERS,
        DEFAULT_GRID_SIZE_METERS,
        YARD_GRID_BOUNDARY,
      )
      if (!center || !isPointInsidePolygon(center, roadPolygonPoints.value)) {
        continue
      }

      cells.push({ label: formatPhysicalGridLabel(phys), phys })
    }
  }

  return cells
})

const visibleRoadPolygonMatchedGridCells = computed(() =>
  roadPolygonMatchedGridCells.value.slice(0, ROAD_POLYGON_VISIBLE_CELL_LIMIT),
)

const roadPolygonResultText = computed(() => {
  const cells = roadPolygonMatchedGridCells.value
    .map((cell) => cell.label)
    .join(', ')
  return [
    `poly: '${roadPolygonLocalPolyText.value}'`,
    `cells: ${cells || '-'}`,
  ].join('\n')
})

function createPolygonFeatureCollection(): DashboardGeoJsonFeatureCollection {
  const features: DashboardGeoJsonFeatureCollection['features'] = []

  for (const polygon of props.polygons) {
    if (polygon.points.length < 3) continue
    const coordinates = polygon.points.map((point) => [point.lng, point.lat])
    coordinates.push(coordinates[0])
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates],
      },
      properties: {
        id: polygon.id,
        name: polygon.name ?? '',
        fill: YARD_JIBUN_KIND_COLORS[polygon.colorKey ?? ''] ?? '#94A3B8',
      },
    })
  }

  return {
    type: 'FeatureCollection',
    features,
  }
}

function createRoadPolygonDrawFeatureCollection(): DashboardGeoJsonFeatureCollection {
  const points = roadPolygonPoints.value
  const features: DashboardGeoJsonFeatureCollection['features'] = []

  if (points.length >= 3) {
    const coordinates = points.map((point) => [point.lng, point.lat])
    coordinates.push(coordinates[0])
    features.push({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [coordinates] },
      properties: { role: 'road-polygon-fill' },
    })
  }

  if (points.length >= 2) {
    const coordinates = points.map((point) => [point.lng, point.lat])
    if (points.length >= 3) coordinates.push(coordinates[0])
    features.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates },
      properties: { role: 'road-polygon-line' },
    })
  }

  points.forEach((point, index) => {
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [point.lng, point.lat] },
      properties: {
        index: index + 1,
        role: 'road-polygon-point',
      },
    })
  })

  return {
    type: 'FeatureCollection',
    features,
  }
}

function ensureRoadPolygonDrawLayer() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  if (!map.getSource(ROAD_POLYGON_DRAW_SOURCE_ID)) {
    map.addSource(ROAD_POLYGON_DRAW_SOURCE_ID, {
      type: 'geojson',
      data: createEmptyFeatureCollection(),
    })
  }
  if (!map.getLayer(ROAD_POLYGON_DRAW_FILL_LAYER_ID)) {
    map.addLayer({
      id: ROAD_POLYGON_DRAW_FILL_LAYER_ID,
      type: 'fill',
      source: ROAD_POLYGON_DRAW_SOURCE_ID,
      filter: ['==', ['get', 'role'], 'road-polygon-fill'],
      paint: {
        'fill-color': '#F37321',
        'fill-opacity': 0.28,
      },
    })
  }
  if (!map.getLayer(ROAD_POLYGON_DRAW_LINE_LAYER_ID)) {
    map.addLayer({
      id: ROAD_POLYGON_DRAW_LINE_LAYER_ID,
      type: 'line',
      source: ROAD_POLYGON_DRAW_SOURCE_ID,
      filter: ['==', ['get', 'role'], 'road-polygon-line'],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#F37321',
        'line-width': 3,
        'line-opacity': 0.95,
      },
    })
  }
  if (!map.getLayer(ROAD_POLYGON_DRAW_POINT_LAYER_ID)) {
    map.addLayer({
      id: ROAD_POLYGON_DRAW_POINT_LAYER_ID,
      type: 'circle',
      source: ROAD_POLYGON_DRAW_SOURCE_ID,
      filter: ['==', ['get', 'role'], 'road-polygon-point'],
      paint: {
        'circle-color': '#FFFFFF',
        'circle-radius': 5,
        'circle-stroke-color': '#F37321',
        'circle-stroke-width': 2,
      },
    })
  }
}

function updateRoadPolygonDrawLayer() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  ensureRoadPolygonDrawLayer()
  ;(
    map.getSource(ROAD_POLYGON_DRAW_SOURCE_ID) as GeoJSONSource | undefined
  )?.setData(createRoadPolygonDrawFeatureCollection())
}

function startRoadPolygonDraw() {
  roadPolygonDrawActive.value = true
  updatePickModeCursor()
}

function finishRoadPolygonDraw() {
  if (roadPolygonPoints.value.length < 3) return
  roadPolygonDrawActive.value = false
  updatePickModeCursor()
}

function undoRoadPolygonPoint() {
  roadPolygonPoints.value = roadPolygonPoints.value.slice(0, -1)
}

function resetRoadPolygonDraw() {
  roadPolygonDrawActive.value = false
  roadPolygonPoints.value = []
  roadPolygonCopyStatus.value = ''
  updatePickModeCursor()
}

function setRoadPolygonCopyStatus(message: string) {
  roadPolygonCopyStatus.value = message
  if (roadPolygonCopyStatusTimer !== null) {
    window.clearTimeout(roadPolygonCopyStatusTimer)
  }
  roadPolygonCopyStatusTimer = window.setTimeout(() => {
    roadPolygonCopyStatus.value = ''
    roadPolygonCopyStatusTimer = null
  }, 1800)
}

async function copyRoadPolygonResult() {
  if (!roadPolygonLocalPolyText.value) return

  try {
    await navigator.clipboard.writeText(roadPolygonResultText.value)
    setRoadPolygonCopyStatus('복사되었습니다')
  } catch {
    setRoadPolygonCopyStatus('복사할 수 없습니다')
  }
}

function ensureDashboardGridLayer() {
  const map = mapRef.value
  if (!map) return

  if (!map.getSource(YARD_GRID_SOURCE_ID)) {
    map.addSource(YARD_GRID_SOURCE_ID, {
      type: 'geojson',
      data: createGridFeatureCollection(),
    })
  }
  if (!map.getLayer(YARD_GRID_LAYER_ID)) {
    map.addLayer({
      id: YARD_GRID_LAYER_ID,
      type: 'line',
      source: YARD_GRID_SOURCE_ID,
      layout: {
        visibility: 'none',
      },
      paint: {
        'line-color': 'rgba(77, 240, 222, 0.58)',
        'line-width': 1.4,
      },
    })
  }
}

function updateGridVisibility() {
  const map = mapRef.value
  if (!map || !mapLoaded.value || !map.getLayer(YARD_GRID_LAYER_ID)) return
  map.setLayoutProperty(
    YARD_GRID_LAYER_ID,
    'visibility',
    props.gridVisible ? 'visible' : 'none',
  )
}

function ensureJibunLayers() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  if (!map.getSource(JIBUN_POLYGON_SOURCE_ID)) {
    map.addSource(JIBUN_POLYGON_SOURCE_ID, {
      type: 'geojson',
      data: createEmptyFeatureCollection(),
    })
  }
  if (!map.getLayer(JIBUN_POLYGON_FILL_LAYER_ID)) {
    map.addLayer({
      id: JIBUN_POLYGON_FILL_LAYER_ID,
      type: 'fill',
      source: JIBUN_POLYGON_SOURCE_ID,
      paint: {
        'fill-color': ['get', 'fill'],
        'fill-opacity': 0.22,
      },
    })
  }
  if (!map.getLayer(JIBUN_POLYGON_LINE_LAYER_ID)) {
    map.addLayer({
      id: JIBUN_POLYGON_LINE_LAYER_ID,
      type: 'line',
      source: JIBUN_POLYGON_SOURCE_ID,
      paint: {
        'line-color': ['get', 'fill'],
        'line-opacity': 0.9,
        'line-width': 1.5,
      },
    })
  }
}

function updateJibunLayers() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  ensureJibunLayers()
  ;(
    map.getSource(JIBUN_POLYGON_SOURCE_ID) as GeoJSONSource | undefined
  )?.setData(createPolygonFeatureCollection())
  updateLabelMarkers()
}

function ensureWorkTrackLayer() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  if (!map.getSource(WORK_TRACK_SOURCE_ID)) {
    map.addSource(WORK_TRACK_SOURCE_ID, {
      type: 'geojson',
      data: createEmptyFeatureCollection(),
      lineMetrics: true,
    })
  }
  if (!map.getLayer(WORK_TRACK_LAYER_ID)) {
    map.addLayer({
      id: WORK_TRACK_LAYER_ID,
      type: 'line',
      source: WORK_TRACK_SOURCE_ID,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#F37321',
        'line-width': 3,
        'line-opacity': 0.68,
        'line-dasharray': WORK_TRACK_BASE_DASH_ARRAY,
      },
    })
  }
  if (!map.getLayer(WORK_TRACK_FLOW_LAYER_ID)) {
    map.addLayer({
      id: WORK_TRACK_FLOW_LAYER_ID,
      type: 'line',
      source: WORK_TRACK_SOURCE_ID,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'none',
      },
      paint: {
        'line-width': 7,
        'line-opacity': 1,
        'line-blur': 1.8,
        'line-gradient': WORK_TRACK_INITIAL_FLOW_GRADIENT,
      },
    })
  }
}

function stopCurrentWorkTrackAnimation() {
  stopWorkTrackAnimation?.()
  stopWorkTrackAnimation = null
}

function updateWorkTrackAnimation() {
  const map = mapRef.value
  if (!map || !mapLoaded.value || !map.getLayer(WORK_TRACK_FLOW_LAYER_ID))
    return

  stopCurrentWorkTrackAnimation()
  const shouldAnimate =
    props.trackAnimated && props.trackCoordinates.length >= 2
  map.setLayoutProperty(
    WORK_TRACK_FLOW_LAYER_ID,
    'visibility',
    shouldAnimate ? 'visible' : 'none',
  )
  if (shouldAnimate) stopWorkTrackAnimation = startWorkTrackAnimation(map)
}

function updateWorkTrack() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  ensureWorkTrackLayer()

  const coordinates = props.trackCoordinates
  const data: DashboardGeoJsonFeatureCollection =
    coordinates.length >= 2
      ? {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: { type: 'LineString', coordinates },
              properties: {},
            },
          ],
        }
      : createEmptyFeatureCollection()

  ;(map.getSource(WORK_TRACK_SOURCE_ID) as GeoJSONSource | undefined)?.setData(
    data,
  )

  updateWorkTrackAnimation()

  // 트랙이 새로 그려지면 전체가 보이도록 지도를 맞춘다.
  if (coordinates.length >= 2) {
    const lngs = coordinates.map(([lng]) => lng)
    const lats = coordinates.map(([, lat]) => lat)
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      {
        padding: WORK_TRACK_FIT_BOUNDS_PADDING,
        bearing: YARD_DEFAULT_BEARING,
        duration: 600,
      },
    )
  }
}

function isSameTrackCoordinate(a: [number, number], b: [number, number]) {
  return a[0] === b[0] && a[1] === b[1]
}

function compactTrackCoordinates(coordinates: Array<[number, number]>) {
  return coordinates.filter(
    (coordinate, index) =>
      index === 0 || !isSameTrackCoordinate(coordinate, coordinates[index - 1]),
  )
}

function updateWorkTrackFromVehicle(
  position: [number, number],
  motion: MapEntityMarkerItem['motion'],
  phase: VehicleRouteAnimationPhase,
) {
  const map = mapRef.value
  if (!map || !mapLoaded.value || !motion) return

  const coordinates =
    phase === 'approach' || phase === 'dwell'
      ? compactTrackCoordinates([position, motion.stop, motion.destination])
      : compactTrackCoordinates([position, motion.destination])

  const source = map.getSource(WORK_TRACK_SOURCE_ID) as
    GeoJSONSource | undefined
  source?.setData({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
        properties: {},
      },
    ],
  })
}

function clearMarkers() {
  stopMarkerAnimations.forEach((stopAnimation) => stopAnimation())
  stopMarkerAnimations = []
  markerRefs.value.forEach((marker) => marker.remove())
  markerRefs.value = []
}

function clearLabelMarkers() {
  labelMarkerRefs.value.forEach((marker) => marker.remove())
  labelMarkerRefs.value = []
}

function updateLabelMarkers() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  clearLabelMarkers()
  labelMarkerRefs.value = props.polygons
    .map((polygon) => {
      if (polygon.points.length === 0 || !polygon.name) return null
      const centroid = polygon.points.reduce(
        (acc, point) => ({
          lat: acc.lat + point.lat,
          lng: acc.lng + point.lng,
        }),
        { lat: 0, lng: 0 },
      )
      const el = document.createElement('div')
      el.className =
        'rounded-sm bg-hw-gray-darker/75 px-1.5 py-0.5 text-c1 font-bold text-hw-white-main shadow-sm'
      el.textContent = polygon.name
      return new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([
          centroid.lng / polygon.points.length,
          centroid.lat / polygon.points.length,
        ])
        .addTo(map)
    })
    .filter((marker): marker is Marker => Boolean(marker))
}

function updateMarkers() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  clearMarkers()
  markerRefs.value = props.mapMarkers
    .map((marker) => {
      if (!Array.isArray(marker.phys) || marker.phys.length < 2) return null
      const el = document.createElement('div')
      const markerToneClass =
        marker.tone === 'obstruction-danger'
          ? 'dashboard-map-marker--danger'
          : marker.tone === 'drop-zone'
            ? 'dashboard-map-marker--drop-zone'
            : marker.tone === 'vehicle'
              ? 'dashboard-map-marker--vehicle'
              : 'dashboard-map-marker--warning'
      el.className = `dashboard-map-marker ${markerToneClass}${marker.selected ? ' dashboard-map-marker--selected' : ''}${marker.selectable ? ' dashboard-map-marker--interactive' : ''}`
      el.title = marker.name ?? marker.label ?? ''

      if (marker.selectable && marker.id) {
        const markerId = marker.id
        const selectMarker = () => emit('selectMarker', markerId)
        el.addEventListener('click', selectMarker)
        el.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return

          event.preventDefault()
          selectMarker()
        })
      }

      if (marker.selected && marker.info && marker.id) {
        const markerId = marker.id
        el.append(
          createDashboardMapMarkerInfoElement(marker.info, () =>
            emit('closeMarkerInfo', markerId),
          ),
        )
      }

      const showWave =
        marker.showWave ?? (marker.selected || marker.tone === 'vehicle')
      if (showWave) {
        const waves = Array.from({ length: 3 }, () => {
          const wave = document.createElement('span')
          wave.className = 'dashboard-map-marker__wave'
          return wave
        })
        el.append(...waves)
      }

      const tag = document.createElement('span')
      tag.className = 'dashboard-map-marker__tag'
      if (marker.tone === 'vehicle') {
        const icon = document.createElement('i')
        icon.className = marker.iconClass ?? 'ti ti-truck'
        icon.setAttribute('aria-hidden', 'true')
        tag.append(icon)
      } else {
        tag.textContent = marker.label ?? marker.name ?? ''
      }
      el.append(tag)

      const mapMarker = new maplibregl.Marker({
        element: el,
        anchor: marker.anchor ?? 'bottom',
        offset: marker.offset ?? [0, 0],
      })
        .setLngLat([marker.phys[0], marker.phys[1]])
        .addTo(map)
      if (marker.selectable) {
        el.role = 'button'
        el.tabIndex = 0
        el.ariaLabel = `${marker.label ?? marker.name ?? '간섭물'} 지도 마커 선택`
      } else {
        el.removeAttribute('role')
        el.removeAttribute('tabindex')
        el.removeAttribute('aria-label')
      }
      const motion = marker.motion
      if (motion) {
        stopMarkerAnimations.push(
          startVehicleRouteAnimation(
            mapMarker,
            [marker.phys[0], marker.phys[1]],
            motion,
            marker.updatesTrack === false
              ? undefined
              : (position, phase) =>
                  updateWorkTrackFromVehicle(position, motion, phase),
          ),
        )
      }
      return mapMarker
    })
    .filter((marker): marker is Marker => Boolean(marker))
}

function focusSelectedMarker() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  const marker = props.mapMarkers.find(
    (item) => item.selected && item.focusOnSelect,
  )
  if (!marker || !Array.isArray(marker.phys) || marker.phys.length < 2) return

  const [lng, lat] = marker.phys
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return

  const currentZoom = map.getZoom()
  map.easeTo({
    center: [lng, lat],
    offset: SELECTED_MARKER_FOCUS_OFFSET,
    zoom: Math.max(
      currentZoom,
      Math.min(
        currentZoom + SELECTED_MARKER_FOCUS_ZOOM_INCREMENT,
        SELECTED_MARKER_MAX_FOCUS_ZOOM,
      ),
    ),
    duration: SELECTED_MARKER_FOCUS_DURATION_MS,
  })
}

function updateLiveMarker() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  const pos = props.livePosition
  if (!pos || !Number.isFinite(pos.lng) || !Number.isFinite(pos.lat)) {
    liveMarkerRef.value?.remove()
    liveMarkerRef.value = null
    return
  }

  if (!liveMarkerRef.value) {
    const el = document.createElement('div')
    el.className = 'live-marker'
    // 시차를 둔 여러 파동 링으로 연속적인 레이더 효과를 낸다.
    const waves = Array.from({ length: 3 }, () => {
      const wave = document.createElement('div')
      wave.className = 'live-marker__wave'
      return wave
    })
    const dot = document.createElement('div')
    dot.className = 'live-marker__dot'
    const label = document.createElement('div')
    label.className = 'live-marker__label'
    label.textContent = pos.label ?? '현재위치'
    el.append(...waves, dot, label)
    liveMarkerRef.value = new maplibregl.Marker({
      element: el,
      anchor: 'center',
    })
      .setLngLat([pos.lng, pos.lat])
      .addTo(map)
    // 표시 중인 이동 경로의 카메라 구도를 유지하고, 단독 위치일 때만 중심을 이동한다.
    if (props.trackCoordinates.length < 2) {
      map.easeTo({ center: [pos.lng, pos.lat], duration: 800 })
    }
    return
  }

  liveMarkerRef.value.setLngLat([pos.lng, pos.lat])
  if (pos.label) {
    const labelEl = liveMarkerRef.value
      .getElement()
      .querySelector('.live-marker__label')
    if (labelEl) labelEl.textContent = pos.label
  }
}

function initializeMap() {
  if (!mapRootRef.value) return

  const map = new maplibregl.Map({
    container: mapRootRef.value,
    style: getMapLibreStyle(props.mapStyle),
    bounds: mapBounds.value,
    fitBoundsOptions: {
      bearing: YARD_DEFAULT_BEARING,
      padding: FIT_BOUNDS_PADDING,
    },
    bearing: YARD_DEFAULT_BEARING,
    pitch: 0,
    dragRotate: false,
    touchZoomRotate: true,
    attributionControl: { compact: true },
  })

  collapseMapAttribution(map)
  mapRef.value = map
  map.on('click', handleMapClick)
  // 핀치 줌(확대/축소)은 허용하되, 야드 정렬 유지를 위해 두 손가락 회전은 비활성화한다.
  map.touchZoomRotate.disableRotation()
  map.once('load', () => {
    map.jumpTo({
      bearing: YARD_DEFAULT_BEARING,
      pitch: 0,
      zoom: map.getZoom() + INITIAL_ZOOM_OFFSET,
    })
    const initialCenter = map.getCenter()
    initialCameraRef.value = {
      center: [initialCenter.lng, initialCenter.lat],
      zoom: map.getZoom(),
    }
    mapLoaded.value = true
    ensureDashboardGridLayer()
    updateGridVisibility()
    updateJibunLayers()
    updateMarkers()
    focusSelectedMarker()
    updateLiveMarker()
    updateWorkTrack()
    updateRoadPolygonDrawLayer()
    updatePickModeCursor()
    requestAnimationFrame(() => map.resize())
  })
}

function syncMapStyle() {
  const map = mapRef.value
  if (!map || !mapLoaded.value) return

  stopCurrentWorkTrackAnimation()
  mapLoaded.value = false
  map.setStyle(getMapLibreStyle(props.mapStyle))
  map.once('style.load', () => {
    map.jumpTo({
      bearing: YARD_DEFAULT_BEARING,
      pitch: 0,
      zoom: map.getZoom(),
    })
    mapLoaded.value = true
    ensureDashboardGridLayer()
    updateGridVisibility()
    updateJibunLayers()
    updateMarkers()
    focusSelectedMarker()
    updateLiveMarker()
    updateWorkTrack()
    updateRoadPolygonDrawLayer()
    updatePickModeCursor()
    requestAnimationFrame(() => map.resize())
  })
}

watch(
  () => props.mapStyle,
  () => syncMapStyle(),
)

watch(
  () => props.gridVisible,
  () => updateGridVisibility(),
)

watch(
  () => props.polygons,
  () => updateJibunLayers(),
  { deep: true },
)

watch(
  () => props.mapMarkers,
  () => updateMarkers(),
  { deep: true },
)

watch(
  () =>
    props.mapMarkers.find((marker) => marker.selected && marker.focusOnSelect)
      ?.id,
  () => focusSelectedMarker(),
)

watch(
  () => props.livePosition,
  () => updateLiveMarker(),
  { deep: true },
)

watch(
  () => props.trackCoordinates,
  () => updateWorkTrack(),
  { deep: true },
)

watch(
  () => props.trackAnimated,
  () => updateWorkTrackAnimation(),
)

watch(
  () => props.pickMode,
  () => updatePickModeCursor(),
)

watch(
  () => roadPolygonPoints.value,
  () => updateRoadPolygonDrawLayer(),
  { deep: true },
)

watch(
  () => roadPolygonDrawActive.value,
  () => updatePickModeCursor(),
)

watch(
  () => props.viewResetRequest,
  (request) => {
    if (!request) return
    resetMapView()
  },
)

onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  stopCurrentWorkTrackAnimation()
  if (roadPolygonCopyStatusTimer !== null) {
    window.clearTimeout(roadPolygonCopyStatusTimer)
  }
  clearMarkers()
  clearLabelMarkers()
  liveMarkerRef.value?.remove()
  liveMarkerRef.value = null
  mapRef.value?.remove()
  mapRef.value = null
  mapLoaded.value = false
})
</script>

<template>
  <div
    class="relative min-w-0 min-h-0 h-full w-full overflow-hidden rounded-sm border border-hw-white-darker bg-hw-gray-darker"
  >
    <div ref="mapRootRef" class="absolute inset-0 h-full w-full" />

    <slot />

    <div
      v-if="roadPolygonToolVisible"
      class="absolute bottom-4 right-4 z-30 w-[340px] max-w-[calc(100%-2rem)] rounded-md border border-hw-gray-lighter bg-hw-white-main/95 p-3 text-hw-text-primary shadow-lg backdrop-blur"
      @click.stop
    >
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-c1 font-bold text-hw-orange-main">도로 폴리곤</p>
          <p class="mt-0.5 text-c1 text-hw-gray-dark">
            {{
              roadPolygonDrawActive
                ? '지도 클릭으로 꼭짓점을 추가합니다'
                : '폴리곤을 그려 격자 목록을 확인합니다'
            }}
          </p>
        </div>
        <span
          class="shrink-0 rounded-sm px-2 py-1 text-c1 font-bold"
          :class="
            roadPolygonDrawActive
              ? 'bg-hw-orange-lighter text-hw-orange-dark'
              : 'bg-hw-white-lighter text-hw-gray-dark'
          "
        >
          {{ roadPolygonPoints.length }}점
        </span>
      </div>

      <div class="mt-3 grid grid-cols-4 gap-1.5">
        <button
          type="button"
          class="rounded-md bg-hw-orange-main px-2 py-2 text-c1 font-bold text-hw-white-main transition-colors hover:bg-hw-orange-dark disabled:bg-hw-gray-main"
          @click="startRoadPolygonDraw"
        >
          그리기
        </button>
        <button
          type="button"
          class="rounded-md border border-hw-gray-lighter bg-hw-white-main px-2 py-2 text-c1 font-bold text-hw-gray-darker transition-colors hover:bg-hw-btn-hover disabled:text-hw-gray-main"
          :disabled="roadPolygonPoints.length < 3"
          @click="finishRoadPolygonDraw"
        >
          완료
        </button>
        <button
          type="button"
          class="rounded-md border border-hw-gray-lighter bg-hw-white-main px-2 py-2 text-c1 font-bold text-hw-gray-darker transition-colors hover:bg-hw-btn-hover disabled:text-hw-gray-main"
          :disabled="roadPolygonPoints.length === 0"
          @click="undoRoadPolygonPoint"
        >
          되돌리기
        </button>
        <button
          type="button"
          class="rounded-md border border-hw-gray-lighter bg-hw-white-main px-2 py-2 text-c1 font-bold text-hw-gray-darker transition-colors hover:bg-hw-btn-hover disabled:text-hw-gray-main"
          :disabled="roadPolygonPoints.length === 0"
          @click="resetRoadPolygonDraw"
        >
          초기화
        </button>
      </div>

      <div class="mt-3 space-y-2">
        <label class="block text-c1 font-bold text-hw-gray-dark">
          복사용 텍스트
          <textarea
            class="mt-1 h-14 w-full resize-none rounded-md border border-hw-gray-lighter bg-hw-white-lighter px-2 py-1 font-mono text-c1 text-hw-text-primary"
            readonly
            :value="roadPolygonResultText"
          />
        </label>

        <div
          class="rounded-md border border-hw-gray-lighter bg-hw-white-lighter p-2"
        >
          <div class="flex items-center justify-between gap-2">
            <b class="text-c1 text-hw-gray-dark">
              포함 격자 {{ roadPolygonMatchedGridCells.length }}개
            </b>
            <button
              type="button"
              class="rounded-sm bg-hw-gray-darker px-2 py-1 text-c1 font-bold text-hw-white-main transition-colors hover:bg-hw-black"
              :disabled="!roadPolygonLocalPolyText"
              @click="copyRoadPolygonResult"
            >
              복사
            </button>
          </div>
          <div
            v-if="visibleRoadPolygonMatchedGridCells.length"
            class="mt-2 flex max-h-28 flex-wrap gap-1 overflow-y-auto"
          >
            <span
              v-for="cell in visibleRoadPolygonMatchedGridCells"
              :key="cell.label"
              class="rounded-sm bg-hw-white-main px-1.5 py-0.5 font-mono text-c1 font-semibold text-hw-text-primary"
            >
              {{ cell.label }}
            </span>
          </div>
          <p v-else class="mt-2 text-c1 text-hw-gray-dark">
            세 점 이상 찍으면 포함 격자가 표시됩니다.
          </p>
          <p
            v-if="
              roadPolygonMatchedGridCells.length >
              visibleRoadPolygonMatchedGridCells.length
            "
            class="mt-2 text-c1 text-hw-gray-dark"
          >
            외
            {{
              roadPolygonMatchedGridCells.length -
              visibleRoadPolygonMatchedGridCells.length
            }}개
          </p>
          <p
            v-if="roadPolygonCopyStatus"
            class="mt-2 text-c1 text-hw-green-dark"
          >
            {{ roadPolygonCopyStatus }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
