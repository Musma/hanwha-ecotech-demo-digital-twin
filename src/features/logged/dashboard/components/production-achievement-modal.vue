<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()

const PROCESS_TABS = [
  { label: '선각', active: true },
  { label: '의장', active: false },
  { label: '도장', active: false },
] as const

const PROCESS_ROWS = [
  {
    label: '강재 가공',
    plan: '4,500 T',
    actual: '2,750 T',
    rate: '61.1%',
    danger: false,
  },
  {
    label: '블록 조립',
    plan: '3,200 T',
    actual: '4,620 T',
    rate: '58.4%',
    danger: true,
  },
] as const
</script>

<template>
  <div class="production-achievement-modal">
    <div class="modal-backdrop" @click="emit('close')"></div>
    <div class="modal-panel">
      <div class="panel-background"></div>
      <div class="panel-header">
        <div class="panel-title">생산량 달성률</div>
        <button class="close-button" type="button" @click="emit('close')">
          <img
            class="close-icon"
            src="@/assets/images/screen-3/icon0.svg"
            alt="닫기"
          />
        </button>
      </div>
      <div class="tab-bar">
        <div class="tab-row">
          <div
            v-for="tab in PROCESS_TABS"
            :key="tab.label"
            class="process-tab"
            :class="{ 'is-active': tab.active }"
          >
            <div class="tab-label">{{ tab.label }}</div>
          </div>
        </div>
      </div>
      <div class="formula-box">
        <div class="formula-head">
          <div class="formula-badge">
            <div class="formula-badge-text">산출 공식</div>
          </div>
          <div class="formula-spacer"></div>
        </div>
        <div class="formula-body">
          <div class="formula-text">
            달성률(%) = 당월 누적 완료 중량 ÷ 당월 계획 총 중량 × 100
          </div>
        </div>
      </div>
      <div class="table-header">
        <div class="header-col header-col-item">
          <div class="header-label">항목</div>
        </div>
        <div class="header-col header-col-plan">
          <div class="header-label">당월 계획</div>
        </div>
        <div class="header-col header-col-actual">
          <div class="header-label">현재 실적</div>
        </div>
        <div class="header-col header-col-rate">
          <div class="header-label">달성률</div>
        </div>
      </div>
      <div class="process-rows">
        <div
          v-for="row in PROCESS_ROWS"
          :key="row.label"
          class="process-row"
          :class="{ 'is-danger': row.danger }"
        >
          <div class="row-label">
            <div class="row-tick"></div>
            <div class="row-text">{{ row.label }}</div>
          </div>
          <div class="row-plan">
            <div class="row-text">{{ row.plan }}</div>
          </div>
          <div class="row-actual">
            <div class="actual-placeholder"></div>
            <div class="row-text">{{ row.actual }}</div>
          </div>
          <div class="row-rate">
            <div class="rate-bar">
              <div class="rate-track">
                <div class="row-rate-fill"></div>
              </div>
              <div class="row-rate-text">{{ row.rate }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="summary-row">
        <div class="summary-label">
          <div class="summary-tick"></div>
          <div class="summary-name">합계</div>
        </div>
        <div class="summary-plan">
          <div class="value-text">7,700 T</div>
        </div>
        <div class="summary-actual">
          <img
            class="actual-icon"
            src="@/assets/images/screen-3/icon1.svg"
            alt=""
          />
          <div class="value-text">4,620 T</div>
        </div>
        <div class="summary-rate">
          <div class="rate-bar">
            <div class="rate-track">
              <div class="summary-rate-fill"></div>
            </div>
            <div class="summary-rate-text">60.0%</div>
          </div>
        </div>
      </div>
      <div class="meta-row">
        <div class="meta-left">
          <div class="meta-label">기준일</div>
          <div class="meta-value">2026-06-30</div>
          <div class="meta-divider-wrap">
            <div class="meta-divider"></div>
          </div>
          <div class="meta-label">당월 경과일</div>
          <div class="meta-value">30 / 30일</div>
        </div>
        <div class="meta-progress">
          <div class="progress-track">
            <div class="progress-fill"></div>
          </div>
          <div class="progress-text">100%</div>
        </div>
      </div>
      <div class="footer-bar">
        <div class="footer-accent"></div>
        <div class="footer-text-wrap">
          <div class="footer-text">※ Raw Data Link 연동</div>
        </div>
        <div class="footer-link">
          <div class="footer-link-text">바로가기</div>
          <img
            class="footer-link-icon"
            src="@/assets/images/screen-3/icon2.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.production-achievement-modal {
  position: absolute;
  left: 0;
  top: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.modal-backdrop {
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  inset: 0;
  pointer-events: auto;
}

.modal-panel {
  width: 580px;
  height: 423px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: calc(50% - 151px);
  pointer-events: auto;
}

.panel-background {
  background: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  width: 100%;
  height: 100%;
  position: absolute;
  right: 0%;
  left: 0%;
  bottom: 0%;
  top: 0%;
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
  width: 100%;
  height: 11.82%;
  position: absolute;
  right: 0%;
  left: 0%;
  bottom: 88.18%;
  top: 0%;
}

.panel-title {
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 18px;
  font-weight: 700;
  position: relative;
  display: flex;
  align-items: center;
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

.tab-bar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 96.55%;
  height: 11.82%;
  position: absolute;
  right: 1.72%;
  left: 1.72%;
  bottom: 74%;
  top: 14.18%;
}

.tab-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  position: relative;
}

.process-tab {
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

  &.is-active {
    background: #ed7100;
    border-color: #ff9c41;
  }
}

.tab-label {
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 16px;
  font-weight: 700;
  position: relative;
  display: flex;
  align-items: center;
}

.formula-box {
  background: rgba(237, 113, 0, 0.05);
  border-radius: 3.5px;
  border-style: solid;
  border-color: #ed7100;
  border-width: 1px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  width: 96.55%;
  height: 13.24%;
  position: absolute;
  right: 1.72%;
  left: 1.72%;
  bottom: 58.39%;
  top: 28.37%;
}

.formula-head {
  display: flex;
  flex-direction: row;
  gap: 7px;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  width: 69px;
  position: relative;
}

.formula-badge {
  background: rgba(237, 113, 0, 0.12);
  border-radius: 3px;
  border-style: solid;
  border-color: rgba(237, 113, 0, 0.2);
  border-width: 1px;
  padding: 3px 10px 3px 10px;
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
  position: relative;
}

.formula-badge-text {
  color: #ed7100;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 12px;
  font-weight: 700;
  position: relative;
}

.formula-spacer {
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
  width: 90px;
  height: 13px;
  position: relative;
}

.formula-body {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 3.5px;
  border-style: solid;
  border-color: rgba(237, 113, 0, 0.1);
  border-width: 1px;
  padding: 7px 10.5px 7px 10.5px;
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
  position: relative;
}

.formula-text {
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 14px;
  font-weight: 400;
  position: relative;
}

.table-header {
  background:
    linear-gradient(
      to left,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.05)
    ),
    linear-gradient(to left, rgba(30, 30, 30, 0.9), rgba(30, 30, 30, 0.9));
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.04);
  border-width: 0px 0px 1px 0px;
  padding: 0px 0px 1px 0px;
  width: 96.21%;
  height: 8.51%;
  position: absolute;
  right: 1.9%;
  left: 1.9%;
  bottom: 47.28%;
  top: 44.21%;
}

.header-col {
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: center;
  justify-content: flex-end;
  height: 35px;
  position: absolute;
  top: 0px;
}

.header-col-item {
  justify-content: flex-start;
  width: 111.13px;
  left: 16px;
}

.header-col-plan {
  width: 111.14px;
  left: 127.13px;
}

.header-col-actual {
  width: 111.14px;
  left: 238.27px;
}

.header-col-rate {
  width: 155.58px;
  left: 349.41px;
}

.header-label {
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 14.25px;
  letter-spacing: 0.95px;
  font-weight: 700;
  position: relative;
}

.process-rows {
  display: flex;
  flex-direction: column;
  width: 96.21%;
  height: 18.91%;
  position: absolute;
  right: 1.9%;
  left: 1.9%;
  bottom: 28.37%;
  top: 52.72%;
}

.process-row {
  background: rgba(30, 30, 30, 0.9);
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.04);
  border-width: 0px 0px 1px 0px;
  padding: 0px 0px 1px 0px;
  width: 100%;
  height: 50%;
  position: relative;
}

.row-label {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  justify-content: flex-start;
  width: 111.13px;
  position: absolute;
  left: 16px;
  top: 11px;
}

.row-tick {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 33554400px;
  flex-shrink: 0;
  width: 3.5px;
  height: 10.5px;
  position: relative;
}

.row-text {
  color: #ffffff;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 400;
  position: relative;
}

.row-plan {
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-end;
  width: 111.14px;
  height: 18px;
  position: absolute;
  left: 127.13px;
  top: 10px;
}

.row-actual {
  display: flex;
  flex-direction: row;
  gap: 5.25px;
  align-items: center;
  justify-content: flex-end;
  width: 111.14px;
  position: absolute;
  left: 238.27px;
  top: 10.5px;
}

.actual-placeholder {
  flex-shrink: 0;
  width: 11px;
  height: 11px;
  position: relative;
  overflow: hidden;
}

.row-rate {
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-end;
  width: 155.58px;
  height: 17.25px;
  position: absolute;
  left: 349.41px;
  top: 10.88px;
}

.rate-bar {
  display: flex;
  flex-direction: row;
  gap: 7px;
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
}

.rate-track {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 33554400px;
  flex-shrink: 0;
  width: 72px;
  height: 5px;
  position: relative;
  overflow: hidden;
}

.row-rate-fill {
  background: #f59e0b;
  border-radius: 33554400px;
  width: 43.98px;
  height: 5px;
  position: absolute;
  left: 0px;
  top: 0px;
  box-shadow: 0px 0px 6px 0px rgba(245, 158, 11, 1);
}

.row-rate-text {
  color: #f59e0b;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 400;
  min-width: 38px;
  position: relative;
}

.process-row.is-danger {
  .row-rate-fill {
    background: #ef4444;
  }

  .row-rate-text {
    color: #ef4444;
  }
}

.summary-row {
  background:
    linear-gradient(to left, rgba(237, 113, 0, 0.05), rgba(237, 113, 0, 0.05)),
    linear-gradient(to left, rgba(30, 30, 30, 0.9), rgba(30, 30, 30, 0.9));
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.04);
  border-width: 0px 0px 1px 0px;
  padding: 0px 0px 1px 0px;
  width: 96.21%;
  height: 10.4%;
  position: absolute;
  right: 1.9%;
  left: 1.9%;
  bottom: 17.97%;
  top: 71.63%;
}

.summary-label {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  justify-content: flex-start;
  width: 111.13px;
  position: absolute;
  left: 16px;
  top: 13px;
}

.summary-tick {
  background: #ed7100;
  border-radius: 33554400px;
  flex-shrink: 0;
  width: 3.5px;
  height: 14px;
  position: relative;
  box-shadow: 0px 0px 5px 0px rgba(237, 113, 0, 1);
}

.summary-name {
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 12px;
  font-weight: 500;
  position: relative;
}

.summary-plan {
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-end;
  width: 111.14px;
  height: 18px;
  position: absolute;
  left: 127.13px;
  top: 13px;
}

.value-text {
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 12px;
  font-weight: 500;
  position: relative;
}

.summary-actual {
  display: flex;
  flex-direction: row;
  gap: 5.25px;
  align-items: center;
  justify-content: flex-end;
  width: 111.14px;
  position: absolute;
  left: 238.27px;
  top: 13px;
}

.actual-icon {
  flex-shrink: 0;
  width: 11px;
  height: 11px;
  position: relative;
  overflow: visible;
}

.summary-rate {
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-end;
  width: 155.58px;
  height: 17.25px;
  position: absolute;
  left: 349.41px;
  top: 13.38px;
}

.summary-rate-fill {
  background: #f59e0b;
  border-radius: 33554400px;
  width: 43.19px;
  height: 5px;
  position: absolute;
  left: 0px;
  top: 0px;
  box-shadow: 0px 0px 6px 0px rgba(245, 158, 11, 1);
}

.summary-rate-text {
  color: #f59e0b;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 12px;
  font-weight: 500;
  min-width: 38px;
  position: relative;
}

.meta-row {
  padding: 0px 20px 0px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 3.55%;
  position: absolute;
  right: 0%;
  left: 0%;
  bottom: 11.82%;
  top: 84.63%;
}

.meta-left {
  display: flex;
  flex-direction: row;
  gap: 7px;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  position: relative;
}

.meta-label {
  color: #888888;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 12px;
  font-weight: 500;
  position: relative;
}

.meta-value {
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 12px;
  font-weight: 500;
  position: relative;
}

.meta-divider-wrap {
  padding: 0px 3.5px 0px 3.5px;
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
  position: relative;
}

.meta-divider {
  background: rgba(255, 255, 255, 0.07);
  flex-shrink: 0;
  width: 1px;
  height: 10.5px;
  position: relative;
}

.meta-progress {
  display: flex;
  flex-direction: row;
  gap: 5.25px;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  position: relative;
}

.progress-track {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 33554400px;
  flex-shrink: 0;
  width: 80px;
  height: 4px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(
    90deg,
    rgba(237, 113, 0, 1) 0%,
    rgba(255, 122, 0, 1) 100%
  );
  border-radius: 33554400px;
  width: 80px;
  height: 4px;
  position: absolute;
  left: 0px;
  top: 0px;
  box-shadow: 0px 0px 6px 0px rgba(59, 130, 246, 1);
}

.progress-text {
  color: #ed7100;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 12px;
  font-weight: 500;
  position: relative;
}

.footer-bar {
  background: rgba(30, 30, 30, 0.9);
  border-radius: 0px 0px 10px 10px;
  border-style: solid;
  border-color: #111111;
  border-width: 1px 0px 0px 0px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 9.46%;
  position: absolute;
  right: 0%;
  left: 0%;
  bottom: 0%;
  top: 90.54%;
}

.footer-accent {
  background: #f97316;
  border-radius: 10px;
  padding: 7px 0px 7px 0px;
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: stretch;
  flex-shrink: 0;
  width: 3.5px;
  position: relative;
}

.footer-text-wrap {
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
  width: 470px;
  position: relative;
}

.footer-text {
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 12px;
  font-weight: 500;
  position: relative;
}

.footer-link {
  border-radius: 3.5px;
  border-style: solid;
  border-color: rgba(249, 115, 22, 0.25);
  border-width: 1px;
  padding: 3.5px 7px 3.5px 7px;
  display: flex;
  flex-direction: row;
  gap: 3.5px;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
}

.footer-link-text {
  color: #f97316;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 9.5px;
  line-height: 14.25px;
  letter-spacing: 0.76px;
  font-weight: 600;
  position: relative;
}

.footer-link-icon {
  flex-shrink: 0;
  width: 9px;
  height: 9px;
  position: relative;
  overflow: visible;
}
</style>
