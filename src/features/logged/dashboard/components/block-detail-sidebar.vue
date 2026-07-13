<script setup lang="ts">
import DetailSidebarSection, {
  type DetailSidebarRow,
} from './detail-sidebar-section.vue'

const emit = defineEmits<{
  close: []
}>()

const basicInfoRows: readonly DetailSidebarRow[] = [
  { label: '호선 번호', value: '4074호선 (Hapag Lloyd)' },
  { label: '블록 유형', value: '컨테이너선 중앙 선체' },
  { label: '중량', value: '145 Ton' },
  { label: '크기', value: '24m × 18m × 12m' },
  { label: '현재 위치', value: '야드 E-2 지번 대기장' },
  { label: '담당 파트', value: '에코텍 선각1파트 (작업자 6명)' },
]

const processInfoRows: readonly DetailSidebarRow[] = [
  { label: '현재 공정', value: '선각 대조립' },
  { label: '진행 상태', value: '진행 중 (75%)', tone: 'warning' },
  { label: '계획 일정', value: '06/25 ~ 07/15' },
  { label: '선행 공정', value: '강재 가공 및 소조립 완료' },
  { label: '후행 공정', value: '선행 도장 대기' },
]

const workfrontCheckRows: readonly DetailSidebarRow[] = [
  { label: '자재 준비', value: 'OK', tone: 'success' },
  { label: '도면/지시서', value: 'OK', tone: 'success' },
  { label: '장비/설비', value: 'OK', tone: 'success' },
  { label: '안전 인프라', value: 'OK', tone: 'success' },
  { label: '선행 검사', value: 'HOLD (승인 대기)', tone: 'danger' },
]

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="block-detail-sidebar">
    <aside class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title">블록 4074-50A-502</div>
        <button class="close-button" type="button" @click="handleClose">
          <img
            class="close-icon"
            src="@/assets/images/screen-5/icon0.svg"
            alt="닫기"
          />
        </button>
      </div>
      <div class="sidebar-body">
        <DetailSidebarSection title="기본 정보" :rows="basicInfoRows" />
        <div class="section-divider" />
        <DetailSidebarSection title="공정 정보" :rows="processInfoRows" />
        <div class="section-divider" />
        <DetailSidebarSection
          title="워크프론트 체크"
          :rows="workfrontCheckRows"
        />
      </div>
    </aside>
  </div>
</template>

<style scoped lang="scss">
.block-detail-sidebar {
  position: absolute;
  left: 0;
  top: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.sidebar-panel {
  background: rgba(30, 30, 30, 0.8);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  justify-content: flex-start;
  width: 320px;
  height: 990px;
  position: absolute;
  right: 0;
  top: 110px;
  backdrop-filter: blur(5px);
  pointer-events: auto;
}

.sidebar-header {
  border-style: solid;
  border-color: #111111;
  border-width: 0 0 1px 0;
  padding: 0 20px 0 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 319px;
  height: 50px;
  position: relative;
}

.sidebar-title {
  color: #ffffff;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 16.5px;
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
  gap: 0;
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

.sidebar-body {
  padding: 20px 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
  width: 319px;
  height: 940px;
  position: relative;
  overflow: hidden;
}

.section-divider {
  border-style: solid;
  border-color: #111111;
  border-width: 1px 0 0 0;
  padding: 1px 0 0 0;
  flex-shrink: 0;
  width: 279px;
  height: 1px;
  position: relative;
}
</style>
