<script setup lang="ts">
import flowChartImage from '@/assets/images/screen-16/flow-chart0.png'
import oilPumpImage from '@/assets/images/screen-16/oil-pump0.png'
import safetyHatImage from '@/assets/images/screen-16/safety-hat0.png'
import trolleyImage from '@/assets/images/screen-16/trolley2.png'

interface TwinTab {
  id: string
  label: string
  icon: string
}

const TWIN_TABS: TwinTab[] = [
  { id: 'process', label: '공정 Twin', icon: flowChartImage },
  { id: 'logistics', label: '물류 Twin', icon: trolleyImage },
  { id: 'equipment', label: '설비 Twin', icon: oilPumpImage },
  { id: 'hse', label: 'HSE Twin', icon: safetyHatImage },
]

const props = withDefaults(defineProps<{ activeTabId?: string | null }>(), {
  activeTabId: null,
})

const emit = defineEmits<{ 'tab-click': [tabId: string] }>()
</script>

<template>
  <div class="dashboard-twin-tabs">
    <div class="twin-tabs-bar">
      <div class="twin-tabs-group">
        <button
          v-for="tab in TWIN_TABS"
          :key="tab.id"
          class="twin-tab"
          :class="{ 'twin-tab--active': props.activeTabId === tab.id }"
          type="button"
          @click="emit('tab-click', tab.id)"
        >
          <div class="twin-tab-icon-box">
            <img class="twin-tab-icon" :src="tab.icon" alt="" />
          </div>
          <div class="twin-tab-label">{{ tab.label }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-twin-tabs {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.twin-tabs-bar {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 1920px;
  height: 60px;
  pointer-events: auto;
  background: #333333;
}

.twin-tabs-group {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
}

.twin-tab {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  height: 40px;
  padding: 0 20px;
  cursor: pointer;
  background: #333333;
  border: 2px solid #999999;
  border-radius: 10px;
}

.twin-tab--active {
  border-color: #ed7100;
}

.twin-tab-icon-box {
  position: relative;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  aspect-ratio: 1;
}

.twin-tab-icon {
  position: absolute;
  top: 50%;
  left: 0;
  width: 24px;
  height: 24px;
  object-fit: cover;
  translate: 0 -50%;
  aspect-ratio: 1;
}

.twin-tab-label {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
}
</style>
