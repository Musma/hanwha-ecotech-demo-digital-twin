<script setup lang="ts">
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
import LogisticsTwinModal from '@/features/logged/dashboard/components/logistics-twin-modal.vue'
import ProcessTwinModal from '@/features/logged/dashboard/components/process-twin-modal.vue'
import ProductionAchievementModal from '@/features/logged/dashboard/components/production-achievement-modal.vue'
import RecordingListModal from '@/features/logged/dashboard/components/recording-list-modal.vue'
import RecordingPlayerView from '@/features/logged/dashboard/components/recording-player-view.vue'
import SideNavigation from '@/features/logged/dashboard/components/side-navigation.vue'
import { useDashboardOverlays } from '@/features/logged/dashboard/composables/use-dashboard-overlays'

const {
  activeModal,
  activeTwinTabId,
  toggleTwinModal,
  isSideNavOpen,
  detailSidebar,
  openModal,
  closeModal,
  toggleSideNav,
  openDetailSidebar,
  closeDetailSidebar,
  openBlockDetailFromInfoModal,
} = useDashboardOverlays()
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
    />

    <SideNavigation
      v-if="isSideNavOpen"
      @block-leaf-click="openDetailSidebar('block')"
      @area-leaf-click="openDetailSidebar('area')"
    />
    <BlockDetailSidebar
      v-if="detailSidebar === 'block'"
      @close="closeDetailSidebar"
    />
    <AreaDetailSidebar
      v-if="detailSidebar === 'area'"
      @close="closeDetailSidebar"
    />

    <ProductionAchievementModal
      v-if="activeModal === 'production'"
      @close="closeModal"
    />
    <BlockInfoModal
      v-if="activeModal === 'block-info'"
      @close="closeModal"
      @open-detail="openBlockDetailFromInfoModal"
    />
    <RecordingListModal
      v-if="activeModal === 'recording-list'"
      @close="closeModal"
      @select-recording="openModal('recording-player')"
    />
    <RecordingPlayerView
      v-if="activeModal === 'recording-player'"
      @close="closeModal"
    />
    <CctvPopup v-if="activeModal === 'cctv'" @close="closeModal" />
    <AlarmPopup v-if="activeModal === 'alarm'" @close="closeModal" />

    <ProcessTwinModal
      v-if="activeModal === 'twin-process'"
      @close="closeModal"
    />
    <LogisticsTwinModal
      v-if="activeModal === 'twin-logistics'"
      @close="closeModal"
    />
    <EquipmentTwinModal
      v-if="activeModal === 'twin-equipment'"
      @close="closeModal"
    />
    <HseTwinModal v-if="activeModal === 'twin-hse'" @close="closeModal" />
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
</style>
