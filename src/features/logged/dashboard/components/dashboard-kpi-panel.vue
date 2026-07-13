<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  'production-click': []
}>()

const isCollapsed = ref(false)

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
}

interface AxisMonth {
  label: string
  slotWidth: number
  left: string
  width: string
}

const ACHIEVEMENT_MONTHS: AxisMonth[] = [
  { label: 'Jan', slotWidth: 14, left: '0%', width: '5.98%' },
  { label: 'Feb', slotWidth: 14, left: '10.35%', width: '5.98%' },
  { label: 'Mar', slotWidth: 15, left: '20.7%', width: '6.41%' },
  { label: 'Apr', slotWidth: 14, left: '31.48%', width: '5.98%' },
  { label: 'May', slotWidth: 16, left: '41.83%', width: '6.84%' },
  { label: 'Jun', slotWidth: 14, left: '53.04%', width: '5.98%' },
  { label: 'Jul', slotWidth: 11, left: '63.39%', width: '4.7%' },
  { label: 'Aug', slotWidth: 15, left: '72.46%', width: '6.41%' },
  { label: 'Sep', slotWidth: 15, left: '83.24%', width: '6.41%' },
  { label: 'Oct', slotWidth: 14, left: '94.02%', width: '5.98%' },
]

const DELIVERY_MONTHS = [
  { label: 'Apr', left: '4%', width: '2.55%' },
  { label: 'May', left: '15.5%', width: '2.91%' },
  { label: 'Jun', left: '27.37%', width: '2.55%' },
  { label: 'Jul', left: '39.32%', width: '2%' },
  { label: 'Aug', left: '50.64%', width: '2.73%' },
  { label: 'Sep', left: '62.32%', width: '2.73%' },
]

const DELIVERY_STATS = [
  [
    { label: 'PND 누계', value: '96.3%' },
    { label: 'MND 누계', value: '97.1%' },
  ],
  [
    { label: 'PND 이번달', value: '96.8%' },
    { label: 'MND 이번달', value: '97.5%' },
  ],
]

const LOAD_LINES: AxisMonth[] = [
  { label: 'A', slotWidth: 6, left: '1.28%', width: '2.56%' },
  { label: 'B', slotWidth: 6, left: '12.11%', width: '2.56%' },
  { label: 'C', slotWidth: 6, left: '22.93%', width: '2.56%' },
  { label: 'D', slotWidth: 6, left: '33.76%', width: '2.56%' },
  { label: 'E', slotWidth: 5, left: '44.59%', width: '2.14%' },
  { label: 'F', slotWidth: 5, left: '54.99%', width: '2.14%' },
  { label: 'G', slotWidth: 6, left: '65.38%', width: '2.56%' },
  { label: 'H', slotWidth: 6, left: '76.21%', width: '2.56%' },
  { label: 'I', slotWidth: 3, left: '87.04%', width: '1.28%' },
  { label: 'J', slotWidth: 5, left: '96.58%', width: '2.14%' },
]

const MATERIAL_ROWS = [
  { label: 'Pipe', value: '91%', width: 225, color: '#60a5fa' },
  { label: 'Valve', value: '83%', width: 210, color: '#818cf8' },
  { label: 'Steel', value: '97%', width: 248, color: '#22d3ee' },
]

const SAFETY_STATS = [
  { label: '무재해일', value: '147', unit: '일' },
  { label: '아차사고', value: '2', unit: '건' },
  { label: 'PPE준수', value: '94', unit: '%' },
]

const LTIR_ROWS = ['전년 동기 대비', '전년 동기 대비', '전년 동기 대비']
</script>

<template>
  <div class="dashboard-kpi-panel">
    <div class="kpi-panel">
      <div
        class="kpi-collapse"
        :class="{ 'kpi-collapse--collapsed': isCollapsed }"
      >
        <div class="kpi-collapse-inner">
          <div class="kpi-glass">
            <div class="kpi-grid">
              <div
                class="glass-card card-achievement"
                role="button"
                tabindex="0"
                @click="emit('production-click')"
                @keydown.enter="emit('production-click')"
              >
                <div class="card-topline card-topline--orange" />
                <div class="card-title">생산량 달성률 · Achievement</div>
                <div class="card-headline">
                  <div class="goal-pill goal-pill--orange-strong">
                    <div class="goal-text goal-text--orange">목표: 100%</div>
                  </div>
                  <div class="big-value">
                    <div class="big-value-number big-value-number--orange">
                      92
                    </div>
                    <div class="big-value-unit">%</div>
                  </div>
                </div>
                <div class="bar-chart-area">
                  <div class="axis-column axis-column--short">
                    <div class="axis-label">10k</div>
                    <div class="axis-label">5k</div>
                    <div class="axis-label">0k</div>
                  </div>
                  <div class="bar-chart-body">
                    <img
                      class="bar-chart-image"
                      src="@/assets/images/screen-2/frame-11712770130.svg"
                      alt=""
                    />
                    <div class="month-axis">
                      <div
                        v-for="month in ACHIEVEMENT_MONTHS"
                        :key="month.label"
                        class="month-slot"
                        :style="{ width: `${month.slotWidth}px` }"
                      >
                        <div
                          class="month-label"
                          :style="{ left: month.left, width: month.width }"
                        >
                          {{ month.label }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-card card-adherence">
                <div class="card-topline card-topline--orange" />
                <div class="card-title">계획 적중률 · Adherence</div>
                <div class="card-headline">
                  <div class="goal-pill goal-pill--orange">
                    <div class="goal-text goal-text--orange">
                      목표: 85% ~ 95%
                    </div>
                  </div>
                  <div class="big-value">
                    <div class="big-value-number big-value-number--orange">
                      88
                    </div>
                    <div class="big-value-unit">%</div>
                  </div>
                </div>
                <div class="stat-row">
                  <div class="stat-box">
                    <div class="stat-label">전월</div>
                    <div class="stat-value stat-value--orange">86%</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-label">누계</div>
                    <div class="stat-value stat-value--orange">85.9%</div>
                  </div>
                </div>
                <div class="stat-row">
                  <div class="stat-box">
                    <div class="stat-label">최종</div>
                    <div class="stat-value stat-value--orange">88%</div>
                  </div>
                </div>
              </div>

              <div class="glass-card card-delivery">
                <div
                  class="card-topline card-topline--blue card-topline--wide"
                />
                <div class="card-title">적기 입고율 · On-Time Delivery</div>
                <div class="card-headline">
                  <div class="goal-pill goal-pill--blue">
                    <div class="goal-text goal-text--blue">목표: 98% 이상</div>
                  </div>
                  <div class="big-value">
                    <div class="big-value-number big-value-number--blue">
                      97.5
                    </div>
                    <div class="big-value-unit">%</div>
                  </div>
                </div>
                <div class="delivery-chart-area">
                  <div class="delivery-chart">
                    <img
                      class="delivery-chart-grid"
                      src="@/assets/images/screen-2/group10.svg"
                      alt=""
                    />
                    <div
                      v-for="month in DELIVERY_MONTHS"
                      :key="month.label"
                      class="delivery-month-label"
                      :style="{ left: month.left, width: month.width }"
                    >
                      {{ month.label }}
                    </div>
                    <div class="delivery-axis">
                      <div class="axis-label axis-label--stretch">100%</div>
                      <div class="axis-label axis-label--stretch">97%</div>
                      <div class="axis-label axis-label--stretch">95%</div>
                    </div>
                    <img
                      class="delivery-goal-line"
                      src="@/assets/images/screen-2/group19.svg"
                      alt=""
                    />
                    <img
                      class="delivery-line delivery-line--pnd"
                      src="@/assets/images/screen-2/group20.svg"
                      alt=""
                    />
                    <img
                      class="delivery-line delivery-line--mnd"
                      src="@/assets/images/screen-2/group21.svg"
                      alt=""
                    />
                  </div>
                  <div class="delivery-stats">
                    <div
                      v-for="(row, rowIndex) in DELIVERY_STATS"
                      :key="rowIndex"
                      class="delivery-stat-row"
                    >
                      <div
                        v-for="stat in row"
                        :key="stat.label"
                        class="stat-box stat-box--fixed"
                      >
                        <div class="stat-label">{{ stat.label }}</div>
                        <div class="stat-value stat-value--blue">
                          {{ stat.value }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-card card-load">
                <div class="card-topline card-topline--blue" />
                <div class="card-title">부하 평준화율 · Load Balance</div>
                <div class="card-headline">
                  <div class="goal-pill goal-pill--blue">
                    <div class="goal-text goal-text--blue">목표: 77% 이상</div>
                  </div>
                  <div class="big-value">
                    <div class="big-value-number big-value-number--blue">
                      81
                    </div>
                    <div class="big-value-unit">%</div>
                  </div>
                </div>
                <div class="bar-chart-area">
                  <div class="axis-column">
                    <div class="axis-label">100</div>
                    <div class="axis-label">75</div>
                    <div class="axis-label">50</div>
                    <div class="axis-label">25</div>
                    <div class="axis-label">0</div>
                  </div>
                  <div class="bar-chart-body">
                    <img
                      class="bar-chart-image"
                      src="@/assets/images/screen-2/frame-11712770131.svg"
                      alt=""
                    />
                    <div class="month-axis month-axis--padded">
                      <div
                        v-for="line in LOAD_LINES"
                        :key="line.label"
                        class="month-slot"
                        :style="{ width: `${line.slotWidth}px` }"
                      >
                        <div
                          class="month-label"
                          :style="{ left: line.left, width: line.width }"
                        >
                          {{ line.label }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-card card-material">
                <div class="card-topline card-topline--blue" />
                <div class="card-title">자재 준비율 · Material Prep</div>
                <div class="card-headline">
                  <div class="goal-pill goal-pill--blue">
                    <div class="goal-text goal-text--blue">목표: 85% ~ 95%</div>
                  </div>
                  <div class="big-value">
                    <div class="big-value-number big-value-number--blue">
                      88
                    </div>
                    <div class="big-value-unit">%</div>
                  </div>
                </div>
                <div class="material-rows">
                  <div
                    v-for="row in MATERIAL_ROWS"
                    :key="row.label"
                    class="material-row"
                  >
                    <div class="material-row-head">
                      <div class="material-label">{{ row.label }}</div>
                      <div class="material-value" :style="{ color: row.color }">
                        {{ row.value }}
                      </div>
                    </div>
                    <div class="material-track-margin">
                      <div class="material-track">
                        <div
                          class="material-fill"
                          :style="{
                            width: `${row.width}px`,
                            background: row.color,
                            boxShadow: `0px 2px 6px 0px rgba(0, 0, 0, 0.4), 0px 0px 5px 0px ${row.color}`,
                          }"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-card card-safety">
                <div class="card-topline card-topline--green" />
                <div class="card-title">Serious Injuries · 중대재해</div>
                <div class="card-headline">
                  <div class="goal-pill goal-pill--green">
                    <div class="goal-text goal-text--green">목표: Zero</div>
                  </div>
                  <div class="big-value">
                    <div class="big-value-number big-value-number--green">
                      0
                    </div>
                    <div class="big-value-unit">건</div>
                  </div>
                </div>
                <div class="safety-stats">
                  <div
                    v-for="stat in SAFETY_STATS"
                    :key="stat.label"
                    class="safety-stat-box"
                  >
                    <div class="safety-stat-line">
                      <div class="stat-label">{{ stat.label }}</div>
                    </div>
                    <div class="safety-stat-line">
                      <div class="safety-stat-value">
                        <span>
                          <span class="safety-stat-number">{{
                            stat.value
                          }}</span>
                          <span class="safety-stat-unit">{{ stat.unit }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-card card-ltir">
                <div class="card-topline card-topline--green" />
                <div class="card-title">LTIR · 근로손실 재해율</div>
                <div class="card-headline">
                  <div class="goal-pill goal-pill--green">
                    <div class="goal-text goal-text--green">
                      목표: 0.050% 이하
                    </div>
                  </div>
                  <div class="big-value">
                    <div class="big-value-number big-value-number--green">
                      0.048
                    </div>
                    <div class="big-value-unit">건</div>
                  </div>
                </div>
                <div
                  v-for="(row, rowIndex) in LTIR_ROWS"
                  :key="rowIndex"
                  class="ltir-row"
                >
                  <div class="ltir-cell">
                    <div class="stat-label">{{ row }}</div>
                  </div>
                  <div class="ltir-cell">
                    <div class="ltir-delta">▼ 22.6%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        class="dashboard-button"
        type="button"
        :aria-expanded="!isCollapsed"
        aria-label="현황판 접기/펼치기"
        @click="toggleCollapsed"
      >
        <img
          class="dashboard-button-icon"
          :class="{ 'dashboard-button-icon--collapsed': isCollapsed }"
          src="@/assets/images/screen-16/icon0.svg"
          alt=""
        />
        <div class="dashboard-button-label">Dashboard</div>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-kpi-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.kpi-panel {
  position: absolute;
  top: 110px;
  left: 50%;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  justify-content: flex-start;
  width: 1170px;
  height: 420px;
  translate: -50%;
}

/* 아코디언: grid-template-rows 0fr/1fr 전환으로 높이를 부드럽게 접는다 */
.kpi-collapse {
  display: grid;
  flex-shrink: 0;
  grid-template-rows: 1fr;
  width: 1170px;
  transition: grid-template-rows 0.35s ease;
}

.kpi-collapse--collapsed {
  grid-template-rows: 0fr;
}

.kpi-collapse-inner {
  min-height: 0;
  overflow: clip;
}

.kpi-glass {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 1170px;
  padding: 10px;
  pointer-events: auto;
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 0 0 10px 10px;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.kpi-collapse--collapsed .kpi-glass {
  opacity: 0;
}

.kpi-grid {
  position: relative;
  display: grid;
  flex-shrink: 0;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-self: stretch;
}

.glass-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  height: 180px;
  padding: 10px;
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 10px;
}

.card-achievement {
  grid-row: 1 / span 1;
  grid-column: 1 / span 1;
  cursor: pointer;
}

.card-adherence {
  grid-row: 1 / span 1;
  grid-column: 2 / span 1;
}

.card-delivery {
  grid-row: 1 / span 1;
  grid-column: 3 / span 2;
}

.card-load {
  grid-row: 2 / span 1;
  grid-column: 1 / span 1;
}

.card-material {
  grid-row: 2 / span 1;
  grid-column: 2 / span 1;
}

.card-safety {
  grid-row: 2 / span 1;
  grid-column: 3 / span 1;
}

.card-ltir {
  grid-row: 2 / span 1;
  grid-column: 4 / span 1;
}

.card-topline {
  position: absolute;
  top: 1px;
  left: 39px;
  flex-shrink: 0;
  width: 227px;
  height: 1px;
}

.card-topline--orange {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(237, 113, 0, 1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}

.card-topline--blue {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(96, 165, 250, 1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}

.card-topline--green {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(74, 222, 128, 1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}

.card-topline--wide {
  width: 500px;
}

.card-title {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 15px;
  color: #ffffff;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-headline {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 0;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  padding: 2px 0 0;
}

.goal-pill {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
  padding: 2px 8px;
  border-style: solid;
  border-width: 1px;
  border-radius: 999px;
}

.goal-pill--orange-strong {
  background: rgba(237, 113, 0, 0.09);
  border-color: rgba(237, 113, 0, 0.44);
}

.goal-pill--orange {
  background: rgba(237, 113, 0, 0.09);
  border-color: rgba(237, 113, 0, 0.19);
}

.goal-pill--blue {
  background: rgba(96, 165, 250, 0.09);
  border-color: rgba(96, 165, 250, 0.19);
}

.goal-pill--green {
  background: rgba(74, 222, 128, 0.09);
  border-color: rgba(74, 222, 128, 0.19);
}

.goal-text {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 10px;
  font-weight: 700;
  line-height: 15px;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.goal-text--orange {
  color: #ed7100;
}

.goal-text--blue {
  color: #60a5fa;
}

.goal-text--green {
  color: #4ade80;
}

.big-value {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: 3px;
  align-items: flex-end;
  justify-content: flex-end;
}

.big-value-number {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 34px;
  font-weight: 700;
  line-height: 34px;
  text-align: left;
}

.big-value-number--orange {
  color: #ed7100;
}

.big-value-number--blue {
  color: #60a5fa;
}

.big-value-number--green {
  color: #4ade80;
}

.big-value-unit {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 19.5px;
  color: #94a3b8;
  text-align: left;
}

.bar-chart-area {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 6px;
  align-items: flex-start;
  justify-content: flex-start;
}

.axis-column {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: flex-end;
  justify-content: space-between;
  width: 15px;
  height: 74px;
}

.axis-column--short {
  width: 15px;
}

.axis-label {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 8px;
  font-weight: 400;
  color: #64748b;
  text-align: right;
}

.axis-label--stretch {
  align-self: stretch;
}

.bar-chart-body {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 5px;
  align-items: center;
  justify-content: flex-start;
  width: 234px;
  height: 95px;
}

.bar-chart-image {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  height: 74px;
  overflow: visible;
}

.month-axis {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
}

.month-axis--padded {
  padding: 0 3px;
}

.month-slot {
  position: static;
  flex-shrink: 0;
  height: 10px;
}

.month-label {
  position: absolute;
  top: 0%;
  bottom: 0%;
  height: 100%;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 8px;
  font-weight: 400;
  color: #64748b;
  text-align: center;
}

.stat-row {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 260px;
}

.stat-box {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
}

.stat-box--fixed {
  flex: none;
  flex-shrink: 0;
  width: 80px;
}

.stat-label {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 9px;
  font-weight: 400;
  line-height: 13.5px;
  color: #64748b;
  text-align: center;
}

.stat-value {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 19.5px;
  text-align: center;
}

.stat-value--orange {
  color: #ed7100;
}

.stat-value--blue {
  font-size: 12px;
  line-height: 18px;
  color: #60a5fa;
}

.delivery-chart-area {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 22px;
  align-items: flex-start;
  justify-content: flex-start;
}

.delivery-chart {
  position: static;
  flex-shrink: 0;
  width: 357.33px;
  height: 79.16px;
}

.delivery-chart-grid {
  position: absolute;
  top: 3.16px;
  left: 29px;
  width: 321px;
  height: 76px;
  overflow: visible;
}

.delivery-month-label {
  position: absolute;
  top: 73.51%;
  height: 11.11%;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 8px;
  font-weight: 400;
  color: #64748b;
  text-align: center;
}

.delivery-axis {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-end;
  justify-content: flex-start;
  width: 21px;
}

.delivery-goal-line {
  position: absolute;
  top: 27.64%;
  right: 36.29%;
  bottom: 72.36%;
  left: 5.28%;
  width: 58.43%;
  height: 0%;
  overflow: visible;
}

.delivery-line {
  position: absolute;
  top: 31.54%;
  right: 35.77%;
  bottom: 47.31%;
  left: 4.73%;
  width: 59.5%;
  height: 21.14%;
  overflow: visible;
}

.delivery-stats {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
}

.delivery-stat-row {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
}

.material-rows {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 7px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 259px;
}

.material-row {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: stretch;
}

.material-row-head {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: space-between;
  align-self: stretch;
  height: 15px;
}

.material-label {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 9px;
  font-weight: 400;
  line-height: 13.5px;
  color: #64748b;
  text-align: left;
}

.material-value {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 10px;
  font-weight: 700;
  line-height: 15px;
  text-align: left;
}

.material-track-margin {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: stretch;
  padding: 3px 0 0;
}

.material-track {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: stretch;
  height: 5px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
}

.material-fill {
  position: relative;
  flex-shrink: 0;
  height: 5px;
  border-radius: 999px;
}

.safety-stats {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: row;
  flex-shrink: 0;
  gap: 8px;
  align-items: flex-start;
  justify-content: center;
  align-self: stretch;
}

.safety-stat-box {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
  height: 52.3px;
  padding: 8px 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
}

.safety-stat-line {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
}

.safety-stat-value {
  position: relative;
  color: #4ade80;
  text-align: center;
}

.safety-stat-number {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 20.8px;
}

.safety-stat-unit {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 10px;
  font-weight: 700;
  line-height: 13px;
}

.ltir-row {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
}

.ltir-cell {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
}

.ltir-delta {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  color: #4ade80;
  text-align: left;
}

.dashboard-button {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 30px;
  padding: 6px 33px;
  pointer-events: auto;
  background: #333333;
  border-radius: 0 0 16px 16px;
}

.dashboard-button-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  overflow: visible;
  transition: rotate 0.2s ease;
}

.dashboard-button-icon--collapsed {
  rotate: 180deg;
}

.dashboard-button-label {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 10px;
  font-weight: 700;
  line-height: 15px;
  color: #ffffff;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
