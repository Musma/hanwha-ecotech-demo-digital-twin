<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import AlarmPopup from '@/features/logged/dashboard/components/alarm-popup.vue'
import AreaDetailSidebar from '@/features/logged/dashboard/components/area-detail-sidebar.vue'
import BlockDetailSidebar from '@/features/logged/dashboard/components/block-detail-sidebar.vue'
import BlockInfoModal from '@/features/logged/dashboard/components/block-info-modal.vue'
import CctvPopup from '@/features/logged/dashboard/components/cctv-popup.vue'
import DashboardHeader from '@/features/logged/dashboard/components/dashboard-header.vue'
import DashboardKpiPanel from '@/features/logged/dashboard/components/dashboard-kpi-panel.vue'
import DashboardMinimap from '@/features/logged/dashboard/components/dashboard-minimap.vue'
import DashboardScene from '@/features/logged/dashboard/components/dashboard-scene.vue'
import DashboardStatusBar from '@/features/logged/dashboard/components/dashboard-status-bar.vue'
import DashboardTwinTabs from '@/features/logged/dashboard/components/dashboard-twin-tabs.vue'
import EquipmentTwinModal from '@/features/logged/dashboard/components/equipment-twin-modal.vue'
import HseTwinModal from '@/features/logged/dashboard/components/hse-twin-modal.vue'
import LlmChatSidebar from '@/features/logged/dashboard/components/llm-chat-sidebar.vue'
import LogisticsTwinModal from '@/features/logged/dashboard/components/logistics-twin-modal.vue'
import ProcessTwinModal from '@/features/logged/dashboard/components/process-twin-modal.vue'
import ProductionAchievementModal from '@/features/logged/dashboard/components/production-achievement-modal.vue'
import RecordingListModal from '@/features/logged/dashboard/components/recording-list-modal.vue'
import RecordingPlayerView from '@/features/logged/dashboard/components/recording-player-view.vue'
import SideNavigation from '@/features/logged/dashboard/components/side-navigation.vue'
import {
  isDashboardModal,
  useDashboardOverlays,
  type DashboardModal,
} from '@/features/logged/dashboard/composables/use-dashboard-overlays'

const route = useRoute()

const {
  activeModal,
  activeTwinTabId,
  toggleTwinModal,
  isSideNavOpen,
  isLlmChatOpen,
  detailSidebar,
  openModal,
  closeModal,
  toggleSideNav,
  toggleLlmChat,
  closeLlmChat,
  openDetailSidebar,
  closeDetailSidebar,
  openBlockDetailFromInfoModal,
} = useDashboardOverlays()

const routeModal = ref<DashboardModal | null>(null)

const normalizeQueryValue = (value: unknown) =>
  Array.isArray(value) ? value[0] : value

const getRouteModal = (): DashboardModal | null => {
  const modalQuery = normalizeQueryValue(route.query.modal)

  if (isDashboardModal(modalQuery)) {
    return modalQuery
  }

  if (isDashboardModal(route.meta.dashboardModal)) {
    return route.meta.dashboardModal
  }

  return null
}

watch(
  () => route.fullPath,
  () => {
    const previousRouteModal = routeModal.value
    const nextRouteModal = getRouteModal()

    routeModal.value = nextRouteModal

    if (nextRouteModal) {
      openModal(nextRouteModal)
      return
    }

    if (previousRouteModal && activeModal.value === previousRouteModal) {
      closeModal()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="dashboard-view">
    <DashboardScene
      @block-click="openModal('block-info')"
      @cctv-click="openModal('cctv')"
    />
    <DashboardKpiPanel @production-click="openModal('production')" />
    <DashboardMinimap />
    <DashboardTwinTabs
      :active-tab-id="activeTwinTabId"
      @tab-click="toggleTwinModal"
    />
    <DashboardStatusBar />
    <DashboardHeader
      @menu-click="toggleSideNav"
      @record-click="openModal('recording-list')"
      @alarm-click="openModal('alarm')"
      @llm-click="toggleLlmChat"
    />

    <Transition name="slide-left">
      <SideNavigation
        v-if="isSideNavOpen"
        @block-leaf-click="openDetailSidebar('block')"
        @area-leaf-click="openDetailSidebar('area')"
      />
    </Transition>
    <Transition name="slide-right">
      <BlockDetailSidebar
        v-if="detailSidebar === 'block'"
        @close="closeDetailSidebar"
      />
    </Transition>
    <Transition name="slide-right">
      <AreaDetailSidebar
        v-if="detailSidebar === 'area'"
        @close="closeDetailSidebar"
      />
    </Transition>
    <!-- v-show 유지: 닫아도 대화 기록이 남도록 언마운트하지 않는다 -->
    <Transition name="slide-right">
      <LlmChatSidebar
        v-show="isLlmChatOpen"
        @close="closeLlmChat"
        @open-process-twin="openModal('twin-process')"
      />
    </Transition>

    <Transition name="modal-fade">
      <ProductionAchievementModal
        v-if="activeModal === 'production'"
        @close="closeModal"
      />
    </Transition>
    <Transition name="modal-fade">
      <BlockInfoModal
        v-if="activeModal === 'block-info'"
        @close="closeModal"
        @open-detail="openBlockDetailFromInfoModal"
      />
    </Transition>
    <Transition name="modal-fade">
      <RecordingListModal
        v-if="activeModal === 'recording-list'"
        @close="closeModal"
        @select-recording="openModal('recording-player')"
      />
    </Transition>
    <Transition name="slide-up">
      <RecordingPlayerView
        v-if="activeModal === 'recording-player'"
        @close="closeModal"
      />
    </Transition>
    <Transition name="modal-fade">
      <CctvPopup v-if="activeModal === 'cctv'" @close="closeModal" />
    </Transition>
    <Transition name="modal-fade">
      <AlarmPopup v-if="activeModal === 'alarm'" @close="closeModal" />
    </Transition>

    <Transition name="modal-fade">
      <ProcessTwinModal
        v-if="activeModal === 'twin-process'"
        @close="closeModal"
      />
    </Transition>
    <Transition name="modal-fade">
      <LogisticsTwinModal
        v-if="activeModal === 'twin-logistics'"
        @close="closeModal"
      />
    </Transition>
    <Transition name="modal-fade">
      <EquipmentTwinModal
        v-if="activeModal === 'twin-equipment'"
        @close="closeModal"
      />
    </Transition>
    <Transition name="modal-fade">
      <HseTwinModal v-if="activeModal === 'twin-hse'" @close="closeModal" />
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.dashboard-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  overflow: clip;
}

/* 좌측 사이드 네비게이션: 왼쪽에서 밀려 들어오는 슬라이드 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-340px);
}

/* 우측 상세 사이드바: 오른쪽에서 밀려 들어오는 슬라이드 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(340px);
}

/* 모달: 백드롭 페이드 + 패널 팝(스케일) */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active :deep(.modal-panel),
.modal-fade-enter-active :deep(.popup-panel),
.modal-fade-enter-active :deep(.alarm-panel) {
  animation: modal-pop 0.25s ease-out;
}

.modal-fade-leave-active :deep(.modal-panel),
.modal-fade-leave-active :deep(.popup-panel),
.modal-fade-leave-active :deep(.alarm-panel) {
  animation: modal-pop 0.2s ease-in reverse;
}

@keyframes modal-pop {
  from {
    opacity: 0;
    transform: scale(0.92);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 녹화 재생 HUD: 하단에서 올라오는 슬라이드 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(240px);
}
</style>
