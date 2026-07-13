<script setup lang="ts">
import iconCctvZoneA from '@/assets/images/screen-16/icon11.svg'
import iconCctvZoneC from '@/assets/images/screen-16/icon12.svg'
import iconCctvZoneD from '@/assets/images/screen-16/icon13.svg'
import iconCctvZoneB from '@/assets/images/screen-16/icon14.svg'
import iconCctvZoneF from '@/assets/images/screen-16/icon15.svg'
import iconCctvZoneH from '@/assets/images/screen-16/icon16.svg'
import iconCctvZoneG from '@/assets/images/screen-16/icon17.svg'
import iconCctvZoneE from '@/assets/images/screen-16/icon18.svg'
import iconCctvZoneI from '@/assets/images/screen-16/icon19.svg'

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
