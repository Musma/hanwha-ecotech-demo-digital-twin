<script setup lang="ts">
defineProps<{
  message: string
  messageKey: number
}>()
</script>

<template>
  <Transition name="login-toast" mode="out-in">
    <div
      v-if="message"
      :key="messageKey"
      class="login-toast"
      role="alert"
      aria-live="assertive"
    >
      <span class="login-toast__icon" aria-hidden="true">!</span>
      <span class="login-toast__message">{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.login-toast {
  position: absolute;
  top: 300px;
  left: 1440.5px;
  z-index: 10;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 14px 22px;
  pointer-events: none;
  background: #222222;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
  transform: translateX(-50%);
}

.login-toast__icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  background: #ff4d4f;
  border-radius: 50%;
}

.login-toast__message {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #ffffff;
  white-space: nowrap;
}

.login-toast-enter-active,
.login-toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.login-toast-enter-from,
.login-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
