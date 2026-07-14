<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import iconCctvZoneA from '@/assets/images/screen-16/icon11.svg'
import iconCctvZoneC from '@/assets/images/screen-16/icon12.svg'
import iconCctvZoneD from '@/assets/images/screen-16/icon13.svg'
import iconCctvZoneB from '@/assets/images/screen-16/icon14.svg'
import iconCctvZoneF from '@/assets/images/screen-16/icon15.svg'
import iconCctvZoneH from '@/assets/images/screen-16/icon16.svg'
import iconCctvZoneG from '@/assets/images/screen-16/icon17.svg'
import iconCctvZoneE from '@/assets/images/screen-16/icon18.svg'
import iconCctvZoneI from '@/assets/images/screen-16/icon19.svg'
import { useLogisticsObstructionStore } from '@/shared/stores/logistics-obstruction'

const emit = defineEmits<{
  'block-click': []
  'cctv-click': []
}>()

interface CctvZone {
  label: string
  left: number
  top: number
  tone: 'green' | 'red'
  icon: string
}

const CCTV_ZONES: CctvZone[] = [
  {
    label: 'CCTV-A ZONE',
    left: 880,
    top: 167,
    tone: 'green',
    icon: iconCctvZoneA,
  },
  {
    label: 'CCTV-C ZONE',
    left: 943,
    top: 312,
    tone: 'red',
    icon: iconCctvZoneC,
  },
  {
    label: 'CCTV-D ZONE',
    left: 1305,
    top: 305,
    tone: 'green',
    icon: iconCctvZoneD,
  },
  {
    label: 'CCTV-B ZONE',
    left: 1482,
    top: 196,
    tone: 'green',
    icon: iconCctvZoneB,
  },
  {
    label: 'CCTV-F ZONE',
    left: 1556,
    top: 480,
    tone: 'green',
    icon: iconCctvZoneF,
  },
  {
    label: 'CCTV-H ZONE',
    left: 1527,
    top: 830,
    tone: 'green',
    icon: iconCctvZoneH,
  },
  {
    label: 'CCTV-G ZONE',
    left: 1230,
    top: 689,
    tone: 'green',
    icon: iconCctvZoneG,
  },
  {
    label: 'CCTV-E ZONE',
    left: 713,
    top: 443,
    tone: 'green',
    icon: iconCctvZoneE,
  },
  {
    label: 'CCTV-I ZONE',
    left: 396,
    top: 862,
    tone: 'green',
    icon: iconCctvZoneI,
  },
]

const logisticsObstructionStore = useLogisticsObstructionStore()
const isRegisteredObstructionInfoOpen = ref(false)
const registeredObstruction = computed(
  () => logisticsObstructionStore.registeredObstruction,
)

const registeredObstructionRows = computed(() => {
  const obstruction = registeredObstruction.value
  if (!obstruction) return []

  return [
    { label: '종류', value: obstruction.kind },
    { label: '위치', value: obstruction.locationLabel },
    { label: '발견시기', value: obstruction.foundAt },
    { label: '상태', value: obstruction.status },
    { label: '보고자', value: obstruction.reporter },
  ]
})

function handleStorageChange(event: StorageEvent) {
  if (event.key !== 'hanwha-logistics-new-obstruction') return

  logisticsObstructionStore.reloadRegisteredObstruction()
}

watch(
  () => registeredObstruction.value?.id,
  () => {
    isRegisteredObstructionInfoOpen.value = false
  },
)

watch(
  () => registeredObstruction.value?.infoOpenRequestAt,
  (requestAt) => {
    if (!requestAt || !registeredObstruction.value) return

    isRegisteredObstructionInfoOpen.value = true
  },
  { immediate: true },
)

onMounted(() => {
  logisticsObstructionStore.reloadRegisteredObstruction()
  window.addEventListener('storage', handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<template>
  <div class="dashboard-scene">
    <img
      class="scene-image-base"
      src="@/assets/images/screen-16/gemini-generated-image-wyy-8-xvwyy-8-xvwyy-8-10.png"
      alt=""
    />
    <img
      class="block-shadow"
      src="@/assets/images/screen-16/rectangle-48350.svg"
      alt=""
    />
    <img
      class="block-object"
      src="@/assets/images/screen-16/gemini-generated-image-xprglhxprglhxprg-removebg-preview-10.png"
      alt=""
    />
    <img
      class="scene-glow"
      src="@/assets/images/screen-16/group-4280.svg"
      alt=""
    />
    <img
      class="block-outline"
      src="@/assets/images/screen-16/rectangle-48180.svg"
      alt=""
    />

    <button
      class="block-hotspot block-hotspot--transporter"
      type="button"
      aria-label="블록 상세 보기"
      @click="emit('block-click')"
    />

    <div
      v-if="registeredObstruction"
      class="registered-obstruction-marker"
      :class="{
        'registered-obstruction-marker--active':
          isRegisteredObstructionInfoOpen,
      }"
    >
      <button
        class="registered-obstruction-button"
        type="button"
        :aria-label="`${registeredObstruction.name} 간섭물 정보 보기`"
        @click="
          isRegisteredObstructionInfoOpen = !isRegisteredObstructionInfoOpen
        "
      >
        <span class="registered-obstruction-label">
          {{ registeredObstruction.label || '신규' }}
        </span>
      </button>

      <aside
        v-if="isRegisteredObstructionInfoOpen"
        class="registered-obstruction-info"
        :aria-label="`${registeredObstruction.name} 간섭물 상세 정보`"
      >
        <header class="registered-obstruction-info-header">
          <div>
            <p class="registered-obstruction-eyebrow">도로 간섭물</p>
            <h3>{{ registeredObstruction.name }}</h3>
          </div>
          <button
            type="button"
            class="registered-obstruction-close"
            aria-label="간섭물 정보 닫기"
            @click="isRegisteredObstructionInfoOpen = false"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <img
          v-if="registeredObstruction.photo"
          class="registered-obstruction-photo"
          :src="registeredObstruction.photo"
          :alt="`${registeredObstruction.name} 현장 사진`"
        />

        <dl class="registered-obstruction-info-list">
          <div
            v-for="row in registeredObstructionRows"
            :key="row.label"
            class="registered-obstruction-info-row"
          >
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>

        <p class="registered-obstruction-detail">
          {{ registeredObstruction.detail }}
        </p>
      </aside>
    </div>

    <div
      v-for="zone in CCTV_ZONES"
      :key="zone.label"
      class="zone-marker"
      :class="{ 'zone-marker--red': zone.tone === 'red' }"
      :style="{ left: `${zone.left}px`, top: `${zone.top}px` }"
    >
      <div class="zone-ring-outer" />
      <div class="zone-ring-inner" />
      <button
        v-if="zone.tone === 'red'"
        class="zone-button zone-button--clickable"
        type="button"
        :aria-label="`${zone.label} CCTV 보기`"
        @click="emit('cctv-click')"
      >
        <img class="zone-icon" :src="zone.icon" alt="" />
        <div class="zone-orbit" />
      </button>
      <div v-else class="zone-button">
        <img class="zone-icon" :src="zone.icon" alt="" />
        <div class="zone-orbit" />
      </div>
      <div class="zone-label">
        <div class="zone-dot" />
        <div class="zone-label-text">{{ zone.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  overflow: clip;
  pointer-events: none;
}

.scene-image-base {
  position: absolute;
  top: 0;
  left: -901.57px;
  width: 2951.87px;
  height: 1647.56px;
  object-fit: cover;
  aspect-ratio: 2951.87 / 1647.56;
}

.block-shadow {
  position: absolute;
  top: 782px;
  left: 457px;
  width: 197px;
  height: 62.5px;
  overflow: visible;
}

.block-object {
  position: absolute;
  top: 749.5px;
  left: 434px;
  width: 200.6px;
  height: 126.61px;
  object-fit: cover;
  aspect-ratio: 200.6 / 126.61;
  transform: rotate(-12.233deg) scale(1, 1);
  transform-origin: 0 0;
}

.scene-glow {
  position: absolute;
  top: 204px;
  left: 1380.05px;
  height: auto;
  overflow: visible;
  transform: translate(-0.53px, -0.47px);
}

.block-outline {
  position: absolute;
  top: 319px;
  left: 831px;
  width: 271.5px;
  height: 140.5px;
  overflow: visible;
  border-radius: 0;
}

.block-hotspot {
  position: absolute;
  cursor: pointer;
  background: transparent;
  pointer-events: auto;
}

.block-hotspot--transporter {
  top: 749.5px;
  left: 434px;
  width: 200.6px;
  height: 126.61px;
  transform: rotate(-12.233deg) scale(1, 1);
  transform-origin: 0 0;
}

.registered-obstruction-marker {
  position: absolute;
  top: 570px;
  left: 960px;
  z-index: 8;
  width: 1px;
  height: 1px;
  pointer-events: auto;
}

.registered-obstruction-button {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  height: 34px;
  padding: 0 12px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  cursor: pointer;
  background: rgba(237, 113, 0, 0.96);
  border: 2px solid rgba(255, 255, 255, 0.95);
  border-radius: 999px;
  box-shadow:
    0 8px 18px rgba(0, 0, 0, 0.45),
    0 0 18px rgba(237, 113, 0, 0.68);
  transform: translate(-50%, -50%);
}

.registered-obstruction-marker--active .registered-obstruction-button {
  background: #ef4444;
  box-shadow:
    0 8px 18px rgba(0, 0, 0, 0.45),
    0 0 18px rgba(239, 68, 68, 0.68);
}

.registered-obstruction-label {
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

.registered-obstruction-info {
  position: absolute;
  top: -28px;
  left: 0;
  width: 430px;
  padding: 16px;
  font-family: 'Noto Sans KR', sans-serif;
  color: #ffffff;
  background: rgba(30, 30, 30, 0.92);
  border: 1px solid rgba(237, 113, 0, 0.72);
  border-radius: 12px;
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.48),
    0 0 22px rgba(237, 113, 0, 0.18);
  backdrop-filter: blur(8px);
  transform: translate(-50%, -100%);
}

.registered-obstruction-info::before {
  position: absolute;
  bottom: -8px;
  left: calc(50% - 7px);
  width: 14px;
  height: 14px;
  content: '';
  background: rgba(30, 30, 30, 0.92);
  border-right: 1px solid rgba(237, 113, 0, 0.72);
  border-bottom: 1px solid rgba(237, 113, 0, 0.72);
  transform: rotate(45deg);
}

.registered-obstruction-info-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.registered-obstruction-eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 800;
  color: #ed7100;
}

.registered-obstruction-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.35;
}

.registered-obstruction-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 0.82);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
}

.registered-obstruction-close span {
  font-size: 18px;
  line-height: 1;
}

.registered-obstruction-photo {
  width: 100%;
  height: 126px;
  margin-top: 12px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
}

.registered-obstruction-info-list {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  row-gap: 8px;
  margin: 12px 0 0;
  font-size: 13px;
}

.registered-obstruction-info-row {
  display: contents;
}

.registered-obstruction-info-row dt {
  color: rgba(255, 255, 255, 0.58);
}

.registered-obstruction-info-row dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.94);
}

.registered-obstruction-detail {
  margin: 12px 0 0;
  padding: 10px;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.84);
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}

.zone-marker {
  position: absolute;
  width: 75px;
  height: 68.72px;

  --zone-color: #10b981;
  --zone-color-dim: rgba(16, 185, 129, 0.13);
  --zone-color-soft: rgba(16, 185, 129, 0.2);
  --zone-color-glow: rgba(16, 185, 129, 1);
}

.zone-marker--red {
  --zone-color: #ed7100;
  --zone-color-dim: rgba(237, 113, 0, 0.13);
  --zone-color-soft: rgba(237, 113, 0, 0.2);
  --zone-color-glow: rgba(237, 113, 0, 1);
}

.zone-ring-outer {
  position: absolute;
  top: 0%;
  right: 4.38%;
  bottom: 0%;
  left: 4%;
  width: 91.62%;
  height: 100%;
  border: 3px solid var(--zone-color);
  border-radius: 44341468px;
  opacity: 0.35;
  box-shadow:
    0 0 10px var(--zone-color),
    inset 0 0 6px var(--zone-color-soft);
  animation: zone-pulse 2s ease-out infinite;
}

.zone-ring-inner {
  position: absolute;
  top: 17.46%;
  right: 20.37%;
  bottom: 17.46%;
  left: 20%;
  width: 59.63%;
  height: 65.08%;
  border: 2px solid var(--zone-color);
  border-radius: 28858998px;
  opacity: 0.69;
  box-shadow: 0 0 8px var(--zone-color);
  animation: zone-pulse 2s ease-out infinite 0.5s;
}

/* 위험(주황) 존은 훨씬 빠른 파동으로 경고 신호를 준다 */
.zone-marker--red .zone-ring-outer {
  border-width: 4px;
  box-shadow:
    0 0 14px var(--zone-color-glow),
    inset 0 0 8px var(--zone-color-soft);
  animation-duration: 0.8s;
}

.zone-marker--red .zone-ring-inner {
  border-width: 3px;
  box-shadow: 0 0 12px var(--zone-color-glow);
  animation-duration: 0.8s;
  animation-delay: 0.2s;
}

@keyframes zone-pulse {
  0% {
    opacity: 1;
    transform: scale(0.5);
  }

  60% {
    opacity: 0.5;
    transform: scale(1.05);
  }

  100% {
    opacity: 0;
    transform: scale(1.35);
  }
}

.zone-button {
  position: absolute;
  top: 23.81%;
  right: 26.19%;
  bottom: 23.81%;
  left: 25.81%;
  display: flex;
  flex-direction: row;
  gap: 0;
  align-items: center;
  justify-content: center;
  width: 48%;
  height: 52.39%;
  background: rgba(6, 12, 26, 0.85);
  border: 1px solid var(--zone-color);
  border-radius: 33554400px;
  box-shadow:
    0 4px 12px 0 rgba(0, 0, 0, 0.6),
    0 0 10px 0 rgba(16, 185, 129, 0.2);
}

.zone-button--clickable {
  cursor: pointer;
  pointer-events: auto;
}

.zone-icon {
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  overflow: visible;
}

.zone-orbit {
  position: absolute;
  top: 4.5px;
  left: 4.5px;
  flex-shrink: 0;
  width: 27px;
  height: 27px;
  padding: 1px;
  border: 1px solid var(--zone-color-dim);
  border-radius: 33554400px;
}

.zone-label {
  position: absolute;
  top: 0.34%;
  right: 0%;
  bottom: 77.1%;
  left: 0%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 22.56%;
  padding: 1.75px 5.25px;
  background: rgba(6, 8, 16, 0.85);
  border: 1px solid var(--zone-color-soft);
  border-radius: 33554400px;
}

.zone-dot {
  flex-shrink: 0;
  width: 4px;
  height: 4px;
  background: var(--zone-color);
  border-radius: 33554400px;
  box-shadow: 0 0 3px 0 var(--zone-color-glow);
}

.zone-label-text {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 8px;
  font-weight: 700;
  color: var(--zone-color);
  text-align: left;
  letter-spacing: 0.3px;
}
</style>
