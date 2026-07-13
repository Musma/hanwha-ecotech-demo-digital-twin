<script setup lang="ts">
import DetailSidebarSection, {
  type DetailSidebarRow,
} from './detail-sidebar-section.vue'

const emit = defineEmits<{
  close: []
}>()

const basicInfoRows: readonly DetailSidebarRow[] = [
  { label: '지번 ID', value: 'LOT-E02-03' },
  { label: '구역 명', value: 'E-2 야드 대조립 대기장 3구역' },
  { label: '구역 면적', value: '1,200m² (40m × 30m)' },
  { label: '정격 하중', value: '200 Ton Limit' },
  { label: '관리 부서', value: '에코텍 물류운영파트' },
]

const loadingInfoRows: readonly DetailSidebarRow[] = [
  { label: '적재 상태', value: '적재 중 (68%)', tone: 'warning' },
  { label: '배치 블록', value: '4074-50A-502', tone: 'white' },
  { label: '블록 중량', value: '145 Ton' },
  { label: '반입 일시', value: '05/28 10:15' },
  { label: '반출 예정', value: '06/15 (도장장 이송 예정)' },
]

const areaStatusCheckRows: readonly DetailSidebarRow[] = [
  { label: '하중 제한', value: 'SAFE', tone: 'success' },
  { label: '바닥 평탄도', value: 'OK', tone: 'success' },
  { label: '장해물 유무', value: 'NONE (양호)', tone: 'success' },
  { label: '소화전 접근성', value: 'OK', tone: 'success' },
  { label: '야간 조도', value: 'HOLD (조명 점검 필요)', tone: 'danger' },
]

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="area-detail-sidebar">
    <aside class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title">소지번 내역 3 - 000000</div>
        <button class="close-button" type="button" @click="handleClose">
          <img
            class="close-icon"
            src="@/assets/images/screen-7/icon0.svg"
            alt="닫기"
          />
        </button>
      </div>
      <div class="sidebar-body">
        <DetailSidebarSection title="기본 정보" :rows="basicInfoRows" />
        <div class="section-divider" />
        <DetailSidebarSection title="적재 정보" :rows="loadingInfoRows" />
        <div class="section-divider" />
        <DetailSidebarSection
          title="구역 상태 체크"
          :rows="areaStatusCheckRows"
        />
      </div>
    </aside>
  </div>
</template>

<style scoped lang="scss">
.area-detail-sidebar {
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
