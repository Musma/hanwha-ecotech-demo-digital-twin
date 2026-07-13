<script setup lang="ts">
const emit = defineEmits<{
  close: []
  'open-detail': []
}>()

interface BlockInfoRow {
  label: string
  value: string
  top: number
  highlighted?: boolean
}

const BLOCK_INFO_ROWS: BlockInfoRow[] = [
  { label: '호선 번호', value: '4074호선 (Hapag Lloyd)', top: 0 },
  { label: '진행 상태', value: '진행 중 (75%)', top: 32, highlighted: true },
  { label: '블록 유형', value: '컨테이너선 중앙 선체', top: 64 },
  { label: '중량', value: '145 Ton', top: 96 },
  { label: '크기', value: '24m × 18m × 12m', top: 128 },
  { label: '현재 위치', value: '야드 E-2 지번 대기장', top: 160 },
]
</script>

<template>
  <div class="block-info-modal">
    <div class="block-highlight">
      <img
        class="block-highlight-outline"
        src="@/assets/images/screen-10/group-4310.svg"
        alt=""
      />
    </div>
    <div class="modal-panel">
      <div class="modal-header">
        <div class="modal-title">블록 4074-50A-502</div>
        <div class="modal-actions">
          <button
            class="detail-button"
            type="button"
            @click="emit('open-detail')"
          >
            상세 보기
          </button>
          <button class="close-button" type="button" @click="emit('close')">
            <img
              class="close-icon"
              src="@/assets/images/screen-10/icon0.svg"
              alt=""
            />
          </button>
        </div>
      </div>
      <div class="info-grid">
        <template v-for="row in BLOCK_INFO_ROWS" :key="row.label">
          <div class="info-label" :style="{ top: `${row.top}px` }">
            {{ row.label }}
          </div>
          <div
            class="info-value"
            :class="{ 'info-value--highlighted': row.highlighted }"
            :style="{ top: `${row.top}px` }"
          >
            {{ row.value }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.block-info-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.block-highlight {
  position: absolute;
  top: 722.99px;
  left: 456px;
  width: 180px;
  height: 120px;
}

.block-highlight-outline {
  position: absolute;
  top: 2.5%;
  right: 1.39%;
  bottom: 2.08%;
  left: 1.11%;
  width: 97.5%;
  height: 95.42%;
  overflow: visible;
}

.modal-panel {
  position: absolute;
  top: 565px;
  left: 660px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: flex-start;
  width: 320px;
  height: 270px;
  pointer-events: auto;
  background: rgba(30, 30, 30, 0.9);
  border-radius: 4px;
}

.modal-header {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  height: 50px;
  padding: 0 10px 0 20px;
  background: rgba(30, 30, 30, 0.9);
  border-color: #111111;
  border-style: solid;
  border-width: 0 0 1px;
  border-radius: 4px 4px 0 0;
}

.modal-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 16.5px;
  color: #ffffff;
  text-align: left;
}

.modal-actions {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
}

.detail-button {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 30px;
  padding: 10px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 16.5px;
  color: #ffffff;
  cursor: pointer;
  background: #555555;
  border: 1px solid #777777;
  border-radius: 8px;
}

.close-button {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 4px;
}

.close-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  overflow: visible;
}

.info-grid {
  position: relative;
  flex-shrink: 0;
  width: 280.58px;
  height: 180px;
}

.info-label {
  position: absolute;
  left: 0;
  width: 149.13px;
  height: 20px;
  overflow: hidden;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #888888;
  text-align: left;
}

.info-value {
  position: absolute;
  left: 95.42px;
  width: 185.17px;
  height: 20px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #e5e7eb;
  text-align: left;
}

.info-value--highlighted {
  color: #ed7100;
}
</style>
