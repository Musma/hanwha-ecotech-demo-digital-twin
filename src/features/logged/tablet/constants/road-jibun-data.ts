export interface RoadJibunRowCellRange {
  axis: 'row'
  from: number
  row: number
  to: number
}

export interface RoadJibunColumnCellRange {
  axis: 'column'
  column: number
  from: number
  to: number
}

export type RoadJibunCellRange =
  RoadJibunColumnCellRange | RoadJibunRowCellRange

export interface RoadJibunSource {
  id: string
  name: string
  poly: string
  cellRanges: RoadJibunCellRange[]
}

export const ROAD_JIBUN_SEED: RoadJibunSource[] = [
  {
    id: 'road-001',
    name: '도로지번 001',
    poly: '(300.7,-0.7)(334.7,0)(344,667.7)(298.8,667.7)',
    cellRanges: [
      { axis: 'row', row: 30, from: 0, to: 66 },
      { axis: 'row', row: 31, from: 0, to: 66 },
      { axis: 'row', row: 32, from: 0, to: 66 },
      { axis: 'row', row: 33, from: 2, to: 66 },
    ],
  },
  {
    id: 'road-002',
    name: '도로지번 002',
    poly: '(335.8,68.7)(639.9,68)(638.5,79.8)(335.1,81.9)',
    cellRanges: [{ axis: 'column', column: 7, from: 34, to: 63 }],
  },
  {
    id: 'road-003',
    name: '도로지번 003',
    poly: '(361.3,81.9)(360,278.4)(371,278.4)(370.1,82.3)',
    cellRanges: [{ axis: 'row', row: 36, from: 8, to: 27 }],
  },
]
