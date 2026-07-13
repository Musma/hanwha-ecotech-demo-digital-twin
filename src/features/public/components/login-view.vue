<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  login: []
}>()

const userId = ref('ecotec')
const password = ref('1234')

const handleLogin = () => {
  emit('login')
}
</script>

<template>
  <div class="login-view">
    <img
      class="scene-image"
      src="@/assets/images/screen-1/image-1020.png"
      alt=""
    />
    <div class="scene-label-backdrop" />
    <img
      class="scene-label"
      src="@/assets/images/screen-1/group-4231.svg"
      alt=""
    />
    <div class="digital-twin-service">Digital Twin Service</div>
    <div class="user-id">User ID</div>
    <input
      v-model="userId"
      class="normal"
      type="text"
      @keydown.enter="handleLogin"
    />
    <div class="password">Password</div>
    <input
      v-model="password"
      class="normal2"
      type="password"
      @keydown.enter="handleLogin"
    />
    <button class="frame-11" type="button" @click="handleLogin">
      <span class="run">Login</span>
    </button>
    <img
      class="group-200"
      src="@/assets/images/screen-1/group-2000.svg"
      alt=""
    />
  </div>
</template>

<style scoped lang="scss">
.login-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  overflow: hidden;
  pointer-events: none;
  background: #ffffff;
}

.scene-image {
  position: absolute;
  top: 0.29px;
  left: 0;
  width: 960px;
  height: 1140px;
  object-fit: cover;
  aspect-ratio: 960/1140;
}

.scene-label-backdrop {
  position: absolute;
  top: 619.27px;
  left: 322.14px;
  width: 212.14px;
  height: 25.4px;
  background: #000000;
  filter: blur(2px);
}

.scene-label {
  position: absolute;
  top: 607.76px;
  left: 326.1px;
  width: 197.26px;
  height: 32.12px;
  overflow: visible;
}

.digital-twin-service {
  position: absolute;
  top: 386.39px;
  left: 1227px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 44px;
  font-weight: 700;
  color: #111111;
  text-align: left;
}

.user-id {
  position: absolute;
  top: 471.39px;
  left: 1231px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--normal, #606060);
  text-align: left;
}

.normal {
  position: absolute;
  top: 490.39px;
  left: 1231px;
  width: 419px;
  height: 47px;
  padding: 0 16px;
  pointer-events: auto;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  color: #111111;
  background: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  outline: none;
  aspect-ratio: 419/47;
}

.password {
  position: absolute;
  top: 557.39px;
  left: 1231px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--normal, #606060);
  text-align: left;
}

.normal2 {
  position: absolute;
  top: 576.39px;
  left: 1231px;
  width: 419px;
  height: 47px;
  padding: 0 16px;
  pointer-events: auto;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  color: #111111;
  background: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  outline: none;
  aspect-ratio: 419/47;
}

.frame-11 {
  position: absolute;
  top: calc(50% - -73.39px);
  right: 14.06%;
  left: 64.11%;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 21.82%;
  height: 47px;
  padding: 4px 27px;
  pointer-events: auto;
  cursor: pointer;
  background: var(--press, #3277ff);
  border: none;
  border-radius: 6px;
  aspect-ratio: 419/47;
}

.run {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
}

.group-200 {
  position: absolute;
  top: 1045.77px;
  left: 1315.75px;
  width: 248.5px;
  height: 31.67px;
  overflow: visible;
  aspect-ratio: 248.5/31.67;
}
</style>
