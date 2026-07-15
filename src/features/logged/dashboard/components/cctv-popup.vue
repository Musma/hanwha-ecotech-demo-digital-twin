<script setup lang="ts">
defineProps<{
  confirmUrl: string
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

interface AlarmField {
  label: string
  value: string
  valueClass: string
}

const ALARM_FIELDS: AlarmField[] = [
  {
    label: '발생 위치',
    value: '기자재공장',
    valueClass: 'value-location',
  },
  { label: '알람 유형', value: '화재 발생', valueClass: 'value-type' },
  { label: '발생 시각', value: '26년 7월 14일 14:04', valueClass: 'value-time' },
  {
    label: '위험 등급',
    value: 'CRITICAL — Level 4',
    valueClass: 'value-level',
  },
]
</script>

<template>
  <div class="cctv-popup">
    <div class="popup-backdrop" @click="emit('close')" />
    <div class="popup-panel">
      <div class="popup-header">
        <div class="header-title">
          <img
            class="title-icon"
            src="@/assets/images/screen-14/icon0.svg"
            alt=""
          />
          <div class="title-text">안전 알람 발생 !</div>
        </div>
        <button class="close-button" type="button" @click="emit('close')">
          <img
            class="close-icon"
            src="@/assets/images/screen-14/icon1.svg"
            alt="닫기"
          />
        </button>
      </div>
      <div class="popup-body">
        <div class="info-grid">
          <template v-for="field in ALARM_FIELDS" :key="field.label">
            <div class="label-cell">
              <div class="info-label">{{ field.label }}</div>
            </div>
            <div class="value-cell">
              <div class="info-value" :class="field.valueClass">
                {{ field.value }}
              </div>
            </div>
          </template>
        </div>
        <div class="popup-actions">
          <button class="history-button" type="button">
            <div class="button-text">알람 내역</div>
          </button>
          <a
            class="confirm-button"
            :href="confirmUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click="emit('confirm')"
          >
            <div class="button-text">확인</div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cctv-popup {
  position: absolute;
  left: 0;
  top: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.popup-backdrop {
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  inset: 0;
  pointer-events: auto;
}

.popup-panel {
  background: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 380px;
  height: 256px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: calc(50% - 68px);
  overflow: hidden;
  pointer-events: auto;
}

.popup-header {
  background: rgba(30, 30, 30, 0.9);
  border-radius: 4px 4px 0px 0px;
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
  overflow: hidden;
}

.header-title {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.title-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  position: relative;
  overflow: visible;
}

.title-text {
  color: #ef4444;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
  position: relative;
}

.close-button {
  border-radius: 3.5px;
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
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

.popup-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 380px;
  position: relative;
}

.info-grid {
  align-self: stretch;
  flex-shrink: 0;
  display: grid;
  gap: 10px;
  row-gap: 12px;
  position: relative;
  grid-template-columns: 120px minmax(0, 1fr);
  grid-template-rows: 20px 20px 20px minmax(0, 1fr);
}

.label-cell {
  width: 120px;
  height: 20px;
  position: relative;
  overflow: hidden;
  grid-column: 1 / span 1;
}

.info-label {
  color: #99a1af;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  position: absolute;
  left: 10px;
  top: 0px;
}

.value-cell {
  height: 20px;
  position: relative;
  grid-column: 2 / span 1;
}

.info-value {
  color: #ffffff;
  text-align: right;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  position: absolute;
  top: 0px;
  right: 0px;
}

.value-level {
  color: #ef4444;
  font-weight: 700;
}

.popup-actions {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 30px;
  position: relative;
}

.history-button {
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
  width: 165px;
  height: 30px;
  position: relative;
  cursor: pointer;
}

.confirm-button {
  background: #ed7100;
  border-radius: 10px;
  padding: 10px 20px 10px 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 165px;
  height: 30px;
  position: relative;
  cursor: pointer;
  text-decoration: none;
}

.button-text {
  color: #ffffff;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  position: relative;
}
</style>
