<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { STAGE_HEIGHT, STAGE_WIDTH } from '@/shared/constants/stage'

const scale = ref(1)

const updateScale = () => {
  scale.value = Math.min(
    window.innerWidth / STAGE_WIDTH,
    window.innerHeight / STAGE_HEIGHT,
  )
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScale)
})
</script>

<template>
  <div class="stage-viewport">
    <div
      class="stage-viewport__stage"
      :style="{ transform: `scale(${scale})` }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.stage-viewport {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  overflow: clip;
  background: #000000;
}

.stage-viewport__stage {
  position: relative;
  flex: none;
  width: 1920px;
  height: 1140px;
  overflow: clip;
  transform-origin: center center;
}
</style>
