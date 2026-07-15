export interface RoadJibunCellRange {
  from: number
  row: number
  to: number
}

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
      { row: 30, from: 0, to: 66 },
      { row: 31, from: 0, to: 66 },
      { row: 32, from: 0, to: 66 },
      { row: 33, from: 2, to: 66 },
    ],
  },
  {
    id: 'road-002',
    name: '도로지번 002',
    poly: '(335.8,68.7)(639.9,68)(638.5,79.8)(335.1,81.9)',
    cellRanges: [{ row: 7, from: 34, to: 63 }],
  },
]
