<script setup lang="ts">
const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>

<template>
  <div class="recording-player-view">
    <section class="player-panel">
      <div class="timeline-dates">
        <div class="timeline-date">25/10/11</div>
        <div class="timeline-date">25/10/31</div>
      </div>
      <div class="timeline">
        <div class="timeline-track" />
        <div class="timeline-progress" />
        <div class="timeline-playhead" />
      </div>
      <div class="player-controls-row">
        <div class="player-title-wrap">
          <div class="player-title">가안_25년 6월 장마 시나리오_250522</div>
        </div>
        <div class="playback-controls">
          <img
            class="control-stop"
            src="@/assets/images/screen-13/group-2140.svg"
            alt=""
          />
          <div class="playback-buttons">
            <img
              class="control-rewind"
              src="@/assets/images/screen-13/group-2141.svg"
              alt=""
            />
            <img
              class="control-play"
              src="@/assets/images/screen-13/rectangle-47250.svg"
              alt=""
            />
            <img
              class="control-forward"
              src="@/assets/images/screen-13/group-2130.svg"
              alt=""
            />
          </div>
          <div class="speed-control">
            <div class="speed-box">
              <div class="speed-text">1 X</div>
              <img
                class="speed-icon"
                src="@/assets/images/screen-13/icon0.svg"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="player-exit">
          <div class="exit-button" @click="emit('close')">
            <div class="exit-label">블랙박스 종료</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.recording-player-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.player-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 1000px;
  height: 140px;
  padding: 20px;
  position: absolute;
  bottom: 90px;
  left: 50%;
  translate: -50%;
  background: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  pointer-events: auto;
}

.timeline-dates {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  width: 960px;
  height: 16px;
  position: relative;
}

.timeline-date {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 16.5px;
  text-align: left;
}

.timeline {
  flex-shrink: 0;
  width: 960px;
  height: 24px;
  position: static;
}

.timeline-track {
  width: 960px;
  height: 14px;
  position: absolute;
  top: 56px;
  left: 50%;
  translate: -50%;
  background: #111111;
  border-radius: 10px;
}

.timeline-progress {
  width: 340px;
  height: 14px;
  position: absolute;
  top: 56px;
  left: calc(50% - 480px);
  background: #ed7100;
  border-radius: 10px;
}

.timeline-playhead {
  width: 8px;
  height: 24px;
  position: absolute;
  top: 51px;
  left: calc(50% - 250px);
  background: #ffffff;
}

.player-controls-row {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  width: 960px;
  position: relative;
}

.player-title-wrap {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  width: 210px;
  position: relative;
}

.player-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 16.5px;
  text-align: left;
}

.playback-controls {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 34px;
  align-items: center;
  justify-content: flex-start;
  width: 250px;
  position: relative;
}

.control-stop {
  flex-shrink: 0;
  width: 22px;
  height: 26px;
  position: relative;
  overflow: visible;
  cursor: pointer;
}

.playback-buttons {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 30px;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}

.control-rewind {
  flex-shrink: 0;
  width: 28px;
  height: 22px;
  position: relative;
  overflow: visible;
  aspect-ratio: 28 / 22;
  cursor: pointer;
}

.control-play {
  flex-shrink: 0;
  width: 22px;
  height: 26px;
  position: relative;
  overflow: visible;
  cursor: pointer;
}

.control-forward {
  flex-shrink: 0;
  width: 28px;
  height: 22px;
  position: relative;
  overflow: visible;
  aspect-ratio: 28 / 22;
  cursor: pointer;
}

.speed-control {
  flex-shrink: 0;
  width: 60px;
  height: 30px;
  position: relative;
}

.speed-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 10px;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background: #111111;
  border: 1px solid #555555;
  border-radius: 10px;
  cursor: pointer;
}

.speed-text {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.5px;
  text-align: left;
}

.speed-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  position: relative;
  overflow: visible;
}

.player-exit {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  padding: 0 0 0 90px;
  position: relative;
}

.exit-button {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 30px;
  padding: 10px;
  position: relative;
  background: #555555;
  border: 1px solid #777777;
  border-radius: 8px;
  cursor: pointer;
}

.exit-label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 16px;
  font-weight: 500;
  line-height: 16.5px;
  text-align: left;
}
</style>
