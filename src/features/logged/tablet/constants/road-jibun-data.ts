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
  {
    id: 'road-006',
    name: '도로지번 006',
    poly: '(372.7,81.4)(375.2,257.6)(362.7,258)(361.9,81.4)',
    cellRanges: [
      { axis: 'row', row: 36, from: 8, to: 25 },
      { axis: 'row', row: 37, from: 25, to: 25 },
    ],
  },
  {
    id: 'road-007',
    name: '도로지번 007',
    poly: '(500.1,80.8)(500.3,101.8)(530.2,102.2)(529.7,80.8)',
    cellRanges: [
      { axis: 'row', row: 50, from: 8, to: 9 },
      { axis: 'row', row: 51, from: 8, to: 9 },
      { axis: 'row', row: 52, from: 8, to: 9 },
    ],
  },
  {
    id: 'road-008',
    name: '도로지번 008',
    poly: '(669.3,116.8)(1051.3,118)(1050.7,96.5)(671.1,94.7)',
    cellRanges: [
      { axis: 'row', row: 67, from: 9, to: 11 },
      { axis: 'row', row: 68, from: 9, to: 11 },
      { axis: 'row', row: 69, from: 9, to: 11 },
      { axis: 'row', row: 70, from: 9, to: 11 },
      { axis: 'row', row: 71, from: 9, to: 11 },
      { axis: 'row', row: 72, from: 9, to: 11 },
      { axis: 'row', row: 73, from: 10, to: 11 },
      { axis: 'row', row: 74, from: 10, to: 11 },
      { axis: 'row', row: 75, from: 10, to: 11 },
      { axis: 'row', row: 76, from: 10, to: 11 },
      { axis: 'row', row: 77, from: 10, to: 11 },
      { axis: 'row', row: 78, from: 10, to: 11 },
      { axis: 'row', row: 79, from: 10, to: 11 },
      { axis: 'row', row: 80, from: 10, to: 11 },
      { axis: 'row', row: 81, from: 10, to: 11 },
      { axis: 'row', row: 82, from: 10, to: 11 },
      { axis: 'row', row: 83, from: 10, to: 11 },
      { axis: 'row', row: 84, from: 10, to: 11 },
      { axis: 'row', row: 85, from: 10, to: 11 },
      { axis: 'row', row: 86, from: 10, to: 11 },
      { axis: 'row', row: 87, from: 10, to: 11 },
      { axis: 'row', row: 88, from: 10, to: 11 },
      { axis: 'row', row: 89, from: 10, to: 11 },
      { axis: 'row', row: 90, from: 10, to: 11 },
      { axis: 'row', row: 91, from: 10, to: 11 },
      { axis: 'row', row: 92, from: 10, to: 11 },
      { axis: 'row', row: 93, from: 10, to: 11 },
      { axis: 'row', row: 94, from: 10, to: 11 },
      { axis: 'row', row: 95, from: 10, to: 11 },
      { axis: 'row', row: 96, from: 10, to: 11 },
      { axis: 'row', row: 97, from: 10, to: 11 },
      { axis: 'row', row: 98, from: 10, to: 11 },
      { axis: 'row', row: 99, from: 10, to: 11 },
      { axis: 'row', row: 100, from: 10, to: 11 },
      { axis: 'row', row: 101, from: 10, to: 11 },
      { axis: 'row', row: 102, from: 10, to: 11 },
      { axis: 'row', row: 103, from: 10, to: 11 },
      { axis: 'row', row: 104, from: 10, to: 11 },
    ],
  },
  {
    id: 'road-009',
    name: '도로지번 009',
    poly: '(1054.2,28.5)(1078.3,29.7)(1077.7,163.3)(1051.2,166.9)',
    cellRanges: [
      { axis: 'row', row: 105, from: 3, to: 16 },
      { axis: 'row', row: 106, from: 3, to: 15 },
      { axis: 'row', row: 107, from: 3, to: 15 },
    ],
  },
  {
    id: 'road-010',
    name: '도로지번 010',
    poly: '(1078.3,142.6)(1528.2,138.8)(1529.8,166.8)(1080.6,162.1)',
    cellRanges: [
      { axis: 'row', row: 108, from: 14, to: 15 },
      { axis: 'row', row: 109, from: 14, to: 15 },
      { axis: 'row', row: 110, from: 14, to: 15 },
      { axis: 'row', row: 111, from: 14, to: 15 },
      { axis: 'row', row: 112, from: 14, to: 15 },
      { axis: 'row', row: 113, from: 14, to: 15 },
      { axis: 'row', row: 114, from: 14, to: 15 },
      { axis: 'row', row: 115, from: 14, to: 15 },
      { axis: 'row', row: 116, from: 14, to: 15 },
      { axis: 'row', row: 117, from: 14, to: 15 },
      { axis: 'row', row: 118, from: 14, to: 15 },
      { axis: 'row', row: 119, from: 14, to: 15 },
      { axis: 'row', row: 120, from: 14, to: 15 },
      { axis: 'row', row: 121, from: 14, to: 15 },
      { axis: 'row', row: 122, from: 14, to: 15 },
      { axis: 'row', row: 123, from: 14, to: 15 },
      { axis: 'row', row: 124, from: 14, to: 15 },
      { axis: 'row', row: 125, from: 14, to: 15 },
      { axis: 'row', row: 126, from: 14, to: 15 },
      { axis: 'row', row: 127, from: 14, to: 15 },
      { axis: 'row', row: 128, from: 14, to: 15 },
      { axis: 'row', row: 129, from: 14, to: 15 },
      { axis: 'row', row: 130, from: 14, to: 15 },
      { axis: 'row', row: 131, from: 14, to: 15 },
      { axis: 'row', row: 132, from: 14, to: 15 },
      { axis: 'row', row: 133, from: 14, to: 15 },
      { axis: 'row', row: 134, from: 14, to: 15 },
      { axis: 'row', row: 135, from: 14, to: 16 },
      { axis: 'row', row: 136, from: 14, to: 16 },
      { axis: 'row', row: 137, from: 14, to: 16 },
      { axis: 'row', row: 138, from: 14, to: 16 },
      { axis: 'row', row: 139, from: 14, to: 16 },
      { axis: 'row', row: 140, from: 14, to: 16 },
      { axis: 'row', row: 141, from: 14, to: 16 },
      { axis: 'row', row: 142, from: 14, to: 16 },
      { axis: 'row', row: 143, from: 14, to: 16 },
      { axis: 'row', row: 144, from: 14, to: 16 },
      { axis: 'row', row: 145, from: 14, to: 16 },
      { axis: 'row', row: 146, from: 14, to: 16 },
      { axis: 'row', row: 147, from: 14, to: 16 },
      { axis: 'row', row: 148, from: 14, to: 16 },
      { axis: 'row', row: 149, from: 14, to: 16 },
      { axis: 'row', row: 150, from: 14, to: 16 },
      { axis: 'row', row: 151, from: 14, to: 16 },
      { axis: 'row', row: 152, from: 14, to: 16 },
    ],
  },
  {
    id: 'road-011',
    name: '도로지번 011',
    poly: '(1507.5,136.9)(1531.7,138.1)(1530.5,24.8)(1506.2,25.6)',
    cellRanges: [{ axis: 'row', row: 151, from: 3, to: 13 }],
  },
  {
    id: 'road-012',
    name: '도로지번 012',
    poly: '(618.7,273.9)(626.3,274.2)(626.7,378.2)(620.4,378.2)',
    cellRanges: [{ axis: 'row', row: 62, from: 27, to: 37 }],
  },
  {
    id: 'road-013',
    name: '도로지번 013',
    poly: '(1049.7,166.5)(1065.6,166.1)(1068.7,262.5)(1047.7,263.3)',
    cellRanges: [
      { axis: 'row', row: 105, from: 17, to: 25 },
      { axis: 'row', row: 106, from: 17, to: 25 },
    ],
  },
]
