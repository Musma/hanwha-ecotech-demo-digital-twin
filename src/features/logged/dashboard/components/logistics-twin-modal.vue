<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="logistics-twin-modal">
    <div class="modal-backdrop" @click="emit('close')" />
    <div class="modal-panel">
      <div class="modal-header">
        <div class="modal-title">물류 Twin</div>
        <button class="close-button" type="button" @click="emit('close')">
          <img
            class="close-icon"
            src="@/assets/images/screen-18/icon11.svg"
            alt=""
          />
        </button>
      </div>
      <img
        class="modal-image"
        src="@/assets/images/screen-18/trolley5.png"
        alt=""
      />
      <div class="modal-footer-spacer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.logistics-twin-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.5);
}

.modal-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 1200px;
  height: 800px;
  pointer-events: auto;
  background: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  translate: -50% -50%;
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
  border-radius: 10px 10px 0 0;
}

.modal-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 16.5px;
  color: #ffffff;
  text-align: left;
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

.modal-image {
  position: relative;
  flex-shrink: 0;
  width: 288px;
  height: 288px;
  aspect-ratio: 1;
  object-fit: cover;
}

.modal-footer-spacer {
  position: relative;
  flex-shrink: 0;
  width: 100px;
  height: 16px;
}
</style>
