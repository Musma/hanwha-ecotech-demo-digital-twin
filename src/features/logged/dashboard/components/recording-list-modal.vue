<script setup lang="ts">
import { RECORDING_LIST } from '@/features/logged/dashboard/constants/recording-list'
import type { RecordingItem } from '@/features/logged/dashboard/types/recording'

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'select-recording', recording: RecordingItem): void
}>()
</script>

<template>
  <div class="recording-list-modal">
    <div class="modal-backdrop" @click="emit('close')" />
    <section class="modal-panel">
      <header class="modal-header">
        <div class="modal-title-wrap">
          <div class="modal-title">실행 계획 시나리오</div>
        </div>
        <button class="close-button" type="button" @click="emit('close')">
          <img
            class="close-icon"
            src="@/assets/images/screen-12/icon10.svg"
            alt="닫기"
          />
        </button>
      </header>
      <div class="date-filter">
        <div class="filter-label">날짜 선택</div>
        <div class="date-field">
          <div class="calendar-icon">
            <img
              class="calendar-body"
              src="@/assets/images/screen-12/rectangle-46750.svg"
              alt=""
            />
            <div class="calendar-dot" />
            <img
              class="calendar-top"
              src="@/assets/images/screen-12/group-1010.svg"
              alt=""
            />
          </div>
          <div class="date-text">2025년 01월 01일</div>
        </div>
        <div class="filter-label">~</div>
        <div class="date-field">
          <div class="calendar-icon">
            <img
              class="calendar-body"
              src="@/assets/images/screen-12/rectangle-46751.svg"
              alt=""
            />
            <div class="calendar-dot" />
            <img
              class="calendar-top"
              src="@/assets/images/screen-12/group-1011.svg"
              alt=""
            />
          </div>
          <div class="date-text">2026년 01월 01일</div>
        </div>
        <button class="search-button" type="button">
          <div class="filter-label">조회</div>
        </button>
      </div>
      <div class="recording-list">
        <div class="recording-rows">
          <div
            v-for="recording in RECORDING_LIST"
            :key="recording.id"
            class="recording-row"
            @click="emit('select-recording', recording)"
          >
            <div class="recording-row-text">{{ recording.name }}</div>
            <div class="recording-row-text">{{ recording.recordedAt }}</div>
          </div>
        </div>
        <div class="list-scrollbar">
          <img
            class="scroll-arrow scroll-arrow--up"
            src="@/assets/images/screen-12/icon11.svg"
            alt=""
          />
          <div class="scroll-track">
            <div class="scroll-thumb" />
          </div>
          <img
            class="scroll-arrow scroll-arrow--down"
            src="@/assets/images/screen-12/icon12.svg"
            alt=""
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.recording-list-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.modal-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
  width: 580px;
  height: 350px;
  position: absolute;
  top: calc(50% - 115px);
  left: 50%;
  translate: -50%;
  background: rgba(30, 30, 30, 0.9);
  border-radius: 10px 10px 10px 3px;
  pointer-events: auto;
}

.modal-header {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  height: 50px;
  padding: 0 10px;
  position: relative;
  background: rgba(30, 30, 30, 0.9);
  border-style: solid;
  border-color: #111111;
  border-width: 0 0 1px 0;
  border-radius: 10px 10px 0 0;
}

.modal-title-wrap {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  position: relative;
}

.modal-title {
  position: relative;
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 16px;
  font-weight: 700;
  line-height: 28px;
  text-align: left;
}

.close-button {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  position: relative;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  position: relative;
  overflow: visible;
}

.date-filter {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
  padding: 10px;
  position: relative;
  border-style: solid;
  border-color: #111111;
  border-width: 1px 0;
}

.filter-label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 16px;
  font-weight: 500;
  line-height: 16.5px;
  text-align: left;
}

.date-field {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 15px;
  align-items: center;
  justify-content: flex-start;
  width: 190px;
  height: 30px;
  padding: 10px;
  position: relative;
  overflow: hidden;
  background: #111111;
  border: 1px solid #555555;
  border-radius: 10px;
}

.calendar-icon {
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  position: static;
}

.calendar-body {
  width: 15px;
  height: 10px;
  position: absolute;
  top: 12.5px;
  left: 10px;
  overflow: visible;
  border-radius: 0;
}

.calendar-dot {
  width: 3px;
  height: 3px;
  position: absolute;
  top: 17.5px;
  left: 20px;
  background: #ffffff;
}

.calendar-top {
  width: 15px;
  height: 6px;
  position: absolute;
  top: 7.5px;
  left: 10px;
  overflow: visible;
}

.date-text {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 16.5px;
  text-align: left;
}

.search-button {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  width: 60px;
  height: 30px;
  padding: 10px;
  position: relative;
  background: #555555;
  border: 1px solid #777777;
  border-radius: 8px;
  cursor: pointer;
}

.recording-list {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 0;
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
  position: relative;
}

.recording-rows {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
  height: 250px;
  padding: 5px;
  position: relative;
  overflow-y: auto;
  background: rgba(30, 30, 30, 0.7);
  border-radius: 3px;
}

.recording-row {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  width: 555px;
  height: 30px;
  padding: 10px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.recording-row-text {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.5px;
  text-align: left;
}

.list-scrollbar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
}

.scroll-arrow {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  position: relative;
  overflow: visible;
}

.scroll-arrow--up {
  border-radius: 3px 3px 0 0;
}

.scroll-arrow--down {
  border-radius: 0 0 3px 3px;
}

.scroll-track {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
  height: 222px;
  position: relative;
  background: #1e1e1e;
}

.scroll-thumb {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 14px;
  height: 45px;
  position: relative;
  background: #444444;
}
</style>
