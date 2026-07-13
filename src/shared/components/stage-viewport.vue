<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { STAGE_HEIGHT, STAGE_WIDTH } from '@/shared/constants/stage'

const scaleX = ref(1)
const scaleY = ref(1)

const updateScale = () => {
  scaleX.value = window.innerWidth / STAGE_WIDTH
  scaleY.value = window.innerHeight / STAGE_HEIGHT
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
      :style="{ transform: `scale(${scaleX}, ${scaleY})` }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.stage-viewport {
  width: 100vw;
  height: 100vh;
  overflow: clip;
  background: #000000;
}

.stage-viewport__stage {
  position: relative;
  width: 1920px;
  height: 1140px;
  overflow: clip;
  transform-origin: left top;
}
</style>
