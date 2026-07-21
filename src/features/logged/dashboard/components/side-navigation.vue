<script setup lang="ts">
import { ref } from 'vue'

import SideNavAreaTab from '@/features/logged/dashboard/components/side-nav-area-tab.vue'
import SideNavBlockTab from '@/features/logged/dashboard/components/side-nav-block-tab.vue'
import SideNavEquipmentTab from '@/features/logged/dashboard/components/side-nav-equipment-tab.vue'
import SideNavWoTab from '@/features/logged/dashboard/components/side-nav-wo-tab.vue'
import {
  SIDE_NAV_TABS,
  type SideNavTabId,
  type SideNavTreeLeaf,
} from '@/features/logged/dashboard/constants/side-navigation'

const emit = defineEmits<{
  'block-leaf-click': [leaf: SideNavTreeLeaf]
  'area-leaf-click': [leaf: SideNavTreeLeaf]
}>()

const activeTab = ref<SideNavTabId>('block')
</script>

<template>
  <div class="side-navigation">
    <div class="side-nav-panel">
      <div class="tab-bar">
        <button
          v-for="tab in SIDE_NAV_TABS"
          :key="tab.id"
          class="tab-item"
          :class="{ 'tab-item--active': activeTab === tab.id }"
          type="button"
          @click="activeTab = tab.id"
        >
          <span
            class="tab-label"
            :class="{ 'tab-label--active': activeTab === tab.id }"
          >
            {{ tab.label }}
          </span>
        </button>
      </div>
      <div class="search-box">
        <img
          class="search-icon"
          src="@/assets/images/screen-4/icon1.svg"
          alt=""
        />
        <div class="search-placeholder">호선/블록 검색 . . .</div>
      </div>
      <SideNavBlockTab
        v-if="activeTab === 'block'"
        @leaf-click="emit('block-leaf-click', $event)"
      />
      <SideNavAreaTab
        v-else-if="activeTab === 'area'"
        @leaf-click="emit('area-leaf-click', $event)"
      />
      <SideNavEquipmentTab v-else-if="activeTab === 'equipment'" />
      <SideNavWoTab v-else />
    </div>
  </div>
</template>

<style scoped lang="scss">
.side-navigation {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.side-nav-panel {
  position: absolute;
  top: 110px;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 350px;
  height: 990px;
  padding: 10px;
  pointer-events: auto;
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(5px);
}

.tab-bar {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  width: 330px;
  height: 40px;
  overflow: hidden;
  background: #444444;
  border-radius: 4px;
}

.tab-item {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  padding: 0 10px;
  cursor: pointer;
  background: rgba(68, 68, 68, 0.7);
  backdrop-filter: blur(5px);
  border-color: #444444;
  border-style: solid;
  border-width: 0 0 2px;
}

.tab-item--active {
  background: #444444;
  border-color: #ed7100;
  border-radius: 4px 0 0;
}

.tab-label {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 18px;
  font-weight: 700;
  line-height: 16.5px;
  color: #ffffff;
  text-align: left;
}

.tab-label--active {
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  color: #ed7100;
}

.search-box {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
  height: 40px;
  padding: 10px;
  overflow: hidden;
  background: rgba(18, 18, 18, 0.5);
  backdrop-filter: blur(5px);
  border: 1px solid #666666;
  border-radius: 10px;
}

.search-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  overflow: visible;
}

.search-placeholder {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 14px;
  font-weight: 400;
  line-height: 16.5px;
  color: #666666;
  text-align: left;
}
</style>
