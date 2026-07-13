<script setup lang="ts">
const emit = defineEmits<{
  'menu-click': []
  'record-click': []
  'alarm-click': []
}>()
</script>

<template>
  <div class="dashboard-header">
    <div class="header-bar">
      <div class="header-left">
        <button
          class="icon-button"
          type="button"
          aria-label="메뉴 열기"
          @click="emit('menu-click')"
        >
          <div class="icon-frame">
            <img
              class="menu-icon"
              src="@/assets/images/screen-16/icon2.svg"
              alt=""
            />
          </div>
        </button>
        <img
          class="header-logo"
          src="@/assets/images/screen-16/group-2000.svg"
          alt="한화오션 에코텍"
        />
      </div>
      <div class="header-right">
        <div class="weather-button">
          <img
            class="weather-icon"
            src="@/assets/images/screen-16/group-2150.svg"
            alt=""
          />
        </div>
        <button
          class="icon-button"
          type="button"
          aria-label="알람 보기"
          @click="emit('alarm-click')"
        >
          <div class="icon-frame">
            <div class="icon-box">
              <img
                class="alarm-icon"
                src="@/assets/images/screen-16/group-2020.svg"
                alt=""
              />
            </div>
          </div>
        </button>
        <button
          class="icon-button"
          type="button"
          aria-label="녹화 목록 보기"
          @click="emit('record-click')"
        >
          <div class="icon-frame">
            <div class="icon-box">
              <img
                class="record-icon"
                src="@/assets/images/screen-16/group-1140.svg"
                alt=""
              />
            </div>
          </div>
        </button>
        <div class="icon-button">
          <div class="icon-frame">
            <div class="icon-box">
              <img
                class="settings-icon"
                src="@/assets/images/screen-16/group-2010.svg"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="user-area">
          <div class="llm-button">
            <img
              class="llm-icon"
              src="@/assets/images/screen-16/icon9.svg"
              alt=""
            />
            <div class="llm-text">
              <div class="llm-label">LLM</div>
            </div>
          </div>
          <div class="user-card">
            <div class="user-info">
              <div class="user-name-wrap">
                <div class="user-name">한화오션 에코텍 김민수 프로</div>
              </div>
              <div class="user-team-wrap">
                <div class="user-team">선각 생산팀 &gt; 에코텍 선각 1파트</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.header-bar {
  position: absolute;
  top: 60px;
  left: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 1920px;
  background: #1e1e1e;
  translate: -50%;
  pointer-events: auto;
}

.header-left {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  width: 852.5px;
}

.icon-button {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
}

button.icon-button {
  cursor: pointer;
}

.icon-frame {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 6px;
  border-radius: 8px;
  aspect-ratio: 1;
}

.menu-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  overflow: visible;
  aspect-ratio: 1;
}

.header-logo {
  flex-shrink: 0;
  width: 248.5px;
  height: 30px;
  overflow: visible;
  aspect-ratio: 248.5 / 30;
}

.header-right {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 0;
  align-items: center;
  justify-content: flex-end;
  width: 852.5px;
  height: 50px;
}

.weather-button {
  position: relative;
  flex-shrink: 0;
  width: 50px;
  height: 50px;
}

.weather-icon {
  position: absolute;
  top: 14px;
  left: 9px;
  height: auto;
  overflow: visible;
}

.icon-box {
  position: relative;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  overflow: hidden;
  aspect-ratio: 1;
}

.alarm-icon {
  position: absolute;
  top: 2px;
  left: 3px;
  height: auto;
  overflow: visible;
}

.record-icon {
  position: absolute;
  top: 16.67%;
  right: 0%;
  bottom: 16.67%;
  left: 4.17%;
  width: 95.83%;
  height: 66.67%;
  overflow: visible;
}

.settings-icon {
  position: absolute;
  top: 8.33%;
  right: 12.5%;
  bottom: 8.33%;
  left: 12.5%;
  width: 75%;
  height: 83.33%;
  overflow: visible;
}

.user-area {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10px;
}

.llm-button {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 30px;
  padding: 10px;
  background: #555555;
  border: 1px solid #777777;
  border-radius: 3.5px;
}

.llm-icon {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  overflow: visible;
}

.llm-text {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: center;
  justify-content: flex-start;
}

.llm-label {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
}

.user-card {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 7px;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 30px;
  padding: 3.5px 7px;
  border: 1px solid rgba(237, 113, 0, 0.15);
  border-radius: 3.5px;
}

.user-info {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-end;
  justify-content: center;
}

.user-name-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: stretch;
}

.user-name {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  text-align: left;
}

.user-team-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
}

.user-team {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 8px;
  font-weight: 500;
  color: #ffffff;
  text-align: left;
  opacity: 0.5;
}
</style>
