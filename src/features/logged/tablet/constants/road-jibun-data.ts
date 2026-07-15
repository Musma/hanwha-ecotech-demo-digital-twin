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
    poly: '(335.8,68)(670.3,68.6)(669.6,79.7)(335.8,82.4)',
    cellRanges: [{ axis: 'column', column: 7, from: 34, to: 66 }],
  },
  {
    id: 'road-004',
    name: '도로지번 004',
    poly: '(339.5,259)(670.7,258.4)(669.5,273.2)(339.5,278)',
    cellRanges: [
      { axis: 'column', column: 26, from: 34, to: 66 },
      { axis: 'column', column: 27, from: 34, to: 54 },
    ],
  },
  {
    id: 'road-005',
    name: '도로지번 005',
    poly: '(650.2,80.1)(649.4,256.3)(670.8,256.7)(669.5,81)',
    cellRanges: [
      { axis: 'row', row: 65, from: 8, to: 25 },
      { axis: 'row', row: 66, from: 8, to: 25 },
    ],
  },
]
