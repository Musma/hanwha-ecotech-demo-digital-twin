import { computed, ref } from 'vue'

export type TwinTabId = 'process' | 'logistics' | 'equipment' | 'hse'

export type DashboardModal =
  | 'production'
  | 'block-info'
  | 'recording-list'
  | 'recording-player'
  | 'cctv'
  | 'alarm'
  | `twin-${TwinTabId}`

export type DetailSidebarKind = 'block' | 'area'

/**
 * 대시보드 위에 겹쳐지는 오버레이(모달/사이드 네비게이션/상세 사이드바) 상태를 관리한다.
 * 모달은 한 번에 하나만 열리고, 사이드 네비게이션과 상세 사이드바는 모달과 독립적으로 열린다.
 */
export const useDashboardOverlays = () => {
  const activeModal = ref<DashboardModal | null>(null)
  const isSideNavOpen = ref(false)
  const isLlmChatOpen = ref(false)
  const detailSidebar = ref<DetailSidebarKind | null>(null)

  const openModal = (modal: DashboardModal) => {
    activeModal.value = modal
  }

  const closeModal = () => {
    activeModal.value = null
  }

  const toggleSideNav = () => {
    isSideNavOpen.value = !isSideNavOpen.value
  }

  const closeSideNav = () => {
    isSideNavOpen.value = false
  }

  const toggleLlmChat = () => {
    isLlmChatOpen.value = !isLlmChatOpen.value
  }

  const closeLlmChat = () => {
    isLlmChatOpen.value = false
  }

  const openDetailSidebar = (kind: DetailSidebarKind) => {
    detailSidebar.value = kind
  }

  const closeDetailSidebar = () => {
    detailSidebar.value = null
  }

  /** 블록 정보 모달의 상세보기: 모달을 닫고 블록 상세 사이드바를 연다 (화면 11 흐름) */
  const openBlockDetailFromInfoModal = () => {
    activeModal.value = null
    detailSidebar.value = 'block'
  }

  /** Twin 탭 클릭: 같은 탭 재클릭 시 모달을 닫고, 다른 탭이면 해당 Twin 모달로 전환 */
  const toggleTwinModal = (tabId: TwinTabId) => {
    const modal: DashboardModal = `twin-${tabId}`
    activeModal.value = activeModal.value === modal ? null : modal
  }

  /** 현재 열린 Twin 모달에 해당하는 탭 id (Twin 탭 활성 표시용) */
  const activeTwinTabId = computed<TwinTabId | null>(() => {
    if (activeModal.value?.startsWith('twin-')) {
      return activeModal.value.slice('twin-'.length) as TwinTabId
    }
    return null
  })

  return {
    activeModal,
    activeTwinTabId,
    toggleTwinModal,
    isSideNavOpen,
    isLlmChatOpen,
    detailSidebar,
    openModal,
    closeModal,
    toggleSideNav,
    closeSideNav,
    toggleLlmChat,
    closeLlmChat,
    openDetailSidebar,
    closeDetailSidebar,
    openBlockDetailFromInfoModal,
  }
}
