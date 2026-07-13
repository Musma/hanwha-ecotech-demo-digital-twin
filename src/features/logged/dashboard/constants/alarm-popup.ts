export interface AlarmPopupTab {
  id: string
  label: string
}

export interface AlarmPopupItem {
  id: string
  title: string
  occurredAt: string
  /** export 원본에서 제목 영역에 392px 고정 폭이 지정된 항목 */
  wideTitle?: boolean
  /** export 원본에서 제목과 버튼 사이에 100px 빈 스페이서가 있는 항목 */
  hasSpacer?: boolean
}

export const ALARM_POPUP_TABS: AlarmPopupTab[] = [
  { id: 'all', label: '전체' },
  { id: 'critical', label: '위험' },
  { id: 'warning', label: '경고' },
]

export const ALARM_POPUP_ITEMS: AlarmPopupItem[] = [
  {
    id: 'alarm-1',
    title: '[Critical] 기자재 공장 화재 발생',
    occurredAt: '발생 시각 : 2026-01-01 16:40:12',
  },
  {
    id: 'alarm-2',
    title: '[Critical] 골리앗 크레인 GC-101 비상 정지',
    occurredAt: '발생 시각 : 2026-01-01 16:40:12',
    wideTitle: true,
  },
  {
    id: 'alarm-3',
    title: '[Critical] 골리앗 크레인 GC-101 점검',
    occurredAt: '발생 시각 : 2026-01-01 16:40:12',
    hasSpacer: true,
  },
]
