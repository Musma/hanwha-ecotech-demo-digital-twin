<script setup lang="ts">
import { XIcon } from '@lucide/vue'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

const emit = defineEmits<{
  close: []
}>()

const videoUrl = `${import.meta.env.BASE_URL}videos/case2.mp4`
const video = useTemplateRef<HTMLVideoElement>('video')
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')
const previousFocus = document.activeElement

const close = () => {
  video.value?.pause()
  emit('close')
}

onMounted(() => closeButton.value?.focus())
onBeforeUnmount(() => {
  video.value?.pause()
  if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
    previousFocus.focus()
  }
})
</script>

<template>
  <div class="case-video-modal" @keydown.esc.stop="close">
    <div class="modal-backdrop" @click="close" />
    <section
      class="modal-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-video-title"
    >
      <header class="modal-header">
        <h2 id="case-video-title">동영상</h2>
        <button
          ref="closeButton"
          class="close-button"
          type="button"
          aria-label="동영상 닫기"
          @click="close"
        >
          <XIcon :size="20" aria-hidden="true" />
        </button>
      </header>
      <video
        ref="video"
        class="video-player"
        :src="videoUrl"
        aria-label="case2 동영상"
        controls
        playsinline
        preload="metadata"
      >
        이 브라우저에서는 동영상 재생을 지원하지 않습니다.
      </video>
    </section>
  </div>
</template>

<style scoped lang="scss">
.case-video-modal {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.6);
}

.modal-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  width: 1700px;
  height: 90%;
  overflow: hidden;
  pointer-events: auto;
  background: #111111;
  border-radius: 10px;
  translate: -50% -50%;
}

.modal-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 10px 0 20px;
  color: #ffffff;
  background: #1e1e1e;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
  }
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 4px;
}

.video-player {
  flex: 1;
  width: 100%;
  min-height: 0;
  object-fit: contain;
  background: #000000;
}
</style>
