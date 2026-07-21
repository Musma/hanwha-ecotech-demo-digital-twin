<script setup lang="ts">
import { ref } from 'vue'

import {
  ALARM_POPUP_ITEMS,
  ALARM_POPUP_TABS,
} from '@/features/logged/dashboard/constants/alarm-popup'

const emit = defineEmits<{
  close: []
}>()

const activeTabId = ref(ALARM_POPUP_TABS[0].id)

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="alarm-popup">
    <div class="backdrop" @click="handleClose" />
    <div class="alarm-panel">
      <div class="panel-header">
        <div class="panel-title">전체 알람 현황</div>
        <button class="close-button" type="button" @click="handleClose">
          <img
            class="close-icon"
            src="@/assets/images/screen-15/icon0.svg"
            alt="닫기"
          />
        </button>
      </div>
      <div class="tab-area">
        <div class="tab-list">
          <button
            v-for="tab in ALARM_POPUP_TABS"
            :key="tab.id"
            class="tab"
            :class="{ 'tab--active': tab.id === activeTabId }"
            type="button"
            @click="activeTabId = tab.id"
          >
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>
      </div>
      <div class="alarm-list">
        <div
          v-for="item in ALARM_POPUP_ITEMS"
          :key="item.id"
          class="alarm-card"
        >
          <div class="alarm-info">
            <div
              class="alarm-title"
              :class="{ 'alarm-title--wide': item.wideTitle }"
            >
              {{ item.title }}
            </div>
            <div class="alarm-time">{{ item.occurredAt }}</div>
          </div>
          <div class="alarm-actions">
            <button class="action-button-outline" type="button">
              <span class="action-label-outline">위치 이동</span>
            </button>
            <button class="action-button-filled" type="button">
              <span class="action-label-filled">LMM Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.alarm-popup {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 30;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.alarm-panel {
  background: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  width: 580px;
  height: 423px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: calc(50% - 151px);
  pointer-events: auto;
}

.panel-header {
  background: rgba(30, 30, 30, 0.9);
  border-radius: 10px 10px 0px 0px;
  border-style: solid;
  border-color: #111111;
  border-width: 0px 0px 1px 0px;
  padding: 0px 10px 0px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  flex-shrink: 0;
  height: 50px;
  position: relative;
}

.panel-title {
  color: #ffffff;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 18px;
  font-weight: 700;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.close-button {
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  position: relative;
  cursor: pointer;
}

.close-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  position: relative;
  overflow: visible;
}

.tab-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
  position: relative;
}

.tab-list {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  position: relative;
}

.tab {
  background: #555555;
  border-radius: 8px;
  border-style: solid;
  border-color: #777777;
  border-width: 1px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 180px;
  height: 50px;
  position: relative;
  cursor: pointer;
}

.tab--active {
  background: #ed7100;
  border-color: #ff9c41;
}

.tab-label {
  color: #ffffff;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 16px;
  font-weight: 700;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.alarm-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
  height: 243px;
  position: relative;
}

.alarm-card {
  background: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  border-style: solid;
  border-color: #555555;
  border-width: 1px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 560px;
  height: 60px;
  position: relative;
}

.alarm-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
  width: 280px;
  position: relative;
}

.alarm-title {
  color: #ffffff;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  line-height: 16.5px;
  font-weight: 500;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.alarm-title--wide {
  width: 392px;
}

.alarm-time {
  color: #ffffff;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 16.5px;
  font-weight: 400;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.alarm-actions {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  height: 40px;
  position: relative;
}

.action-button-outline {
  border-radius: 10px;
  border-style: solid;
  border-color: #ed7100;
  border-width: 1px;
  padding: 10px 20px 10px 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100px;
  height: 40px;
  position: relative;
  cursor: pointer;
}

.action-label-outline {
  color: #ffffff;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 16.5px;
  font-weight: 500;
  position: relative;
}

.action-button-filled {
  background: #ed7100;
  border-radius: 10px;
  padding: 10px 20px 10px 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100px;
  height: 40px;
  position: relative;
  cursor: pointer;
}

.action-label-filled {
  color: #ffffff;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  line-height: 16.5px;
  font-weight: 500;
  position: relative;
}
</style>
