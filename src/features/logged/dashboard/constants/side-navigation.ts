export const SIDE_NAV_TABS = [
  { id: 'block', label: '블록' },
  { id: 'area', label: '지번' },
  { id: 'equipment', label: '설비' },
  { id: 'wo', label: 'W/O' },
] as const

export type SideNavTabId = (typeof SIDE_NAV_TABS)[number]['id']

export interface SideNavTreeLeaf {
  id: string
  label: string
}

export interface SideNavTreeGroup {
  id: string
  label: string
  expanded?: boolean
  useNotoLabel?: boolean
  leaves?: SideNavTreeLeaf[]
}

export interface SideNavTreeNode {
  id: string
  label: string
  expanded?: boolean
  groups?: SideNavTreeGroup[]
}

export const BLOCK_TREE_NODES: SideNavTreeNode[] = [
  { id: 'ship-2585', label: '2585 - LNG - Maran Gas' },
  { id: 'ship-2586', label: '2586 - LNG - Maran Gas' },
  { id: 'ship-2588', label: '2588 - LNG - Evergreen' },
  {
    id: 'ship-4074',
    label: '4074 - CONT - Hapag Lloyd',
    expanded: true,
    groups: [
      {
        id: 'block-50a',
        label: '50A',
        expanded: true,
        leaves: [
          { id: 'block-50a-501', label: '501' },
          { id: 'block-50a-502', label: '502' },
          { id: 'block-50a-503', label: '503' },
          { id: 'block-50a-504', label: '504' },
        ],
      },
      {
        id: 'block-50b',
        label: '50B',
        expanded: true,
        leaves: [
          { id: 'block-50b-501', label: '501' },
          { id: 'block-50b-502', label: '502' },
          { id: 'block-50b-501-2', label: '501' },
          { id: 'block-50b-502-2', label: '502' },
        ],
      },
    ],
  },
]

export const AREA_TREE_NODES: SideNavTreeNode[] = [
  { id: 'area-l1', label: '대지번 내역 1 - 000000' },
  { id: 'area-l2', label: '대지번 내역 2 - 000000' },
  { id: 'area-l3', label: '대지번 내역 3 - 000000' },
  { id: 'area-l4', label: '대지번 내역 4 - 000000' },
  {
    id: 'area-l5',
    label: '대지번 내역 5 - 000000',
    expanded: true,
    groups: [
      {
        id: 'area-m1',
        label: '중지번 내역 1 - 000000',
        expanded: true,
        leaves: [
          { id: 'area-s1', label: '소지번 내역 1 - 000000' },
          { id: 'area-s2', label: '소지번 내역 2 - 000000' },
          { id: 'area-s3', label: '소지번 내역 3 - 000000' },
          { id: 'area-s4', label: '소지번 내역 4 - 000000' },
        ],
      },
      {
        id: 'area-m2',
        label: '중지번 내역 2 - 000000',
        expanded: true,
        leaves: [
          { id: 'area-s5', label: '소지번 내역 5 - 000000' },
          { id: 'area-s6', label: '소지번 내역 6 - 000000' },
          { id: 'area-s7', label: '소지번 내역 7 - 000000' },
          { id: 'area-s8', label: '소지번 내역 8 - 000000' },
        ],
      },
    ],
  },
]

export const EQUIPMENT_TREE_NODES: SideNavTreeNode[] = [
  {
    id: 'cctv',
    label: 'CCTV',
    expanded: true,
    groups: [
      {
        id: 'zone-a',
        label: 'A Zone',
        expanded: true,
        leaves: [
          { id: 'cctv-1', label: 'CCTV 1' },
          { id: 'cctv-2', label: 'CCTV 2' },
          { id: 'cctv-3', label: 'CCTV 3' },
          { id: 'cctv-4', label: 'CCTV 4' },
          { id: 'cctv-5', label: 'CCTV 5' },
        ],
      },
      {
        id: 'zone-b',
        label: 'B Zone',
        expanded: true,
        leaves: [
          { id: 'cctv-6', label: 'CCTV 6' },
          { id: 'cctv-7', label: 'CCTV 7' },
          { id: 'cctv-8', label: 'CCTV 8' },
          { id: 'cctv-9', label: 'CCTV 9' },
        ],
      },
      { id: 'zone-b2', label: 'B Zone' },
      { id: 'zone-c', label: 'C Zone', useNotoLabel: true },
      { id: 'zone-d', label: 'D Zone', useNotoLabel: true },
      { id: 'zone-e', label: 'E Zone', useNotoLabel: true },
      { id: 'zone-f', label: 'F Zone', useNotoLabel: true },
      { id: 'zone-g', label: 'G Zone', useNotoLabel: true },
      { id: 'zone-h', label: 'H Zone', useNotoLabel: true },
      { id: 'zone-i', label: 'I Zone', useNotoLabel: true },
    ],
  },
]
