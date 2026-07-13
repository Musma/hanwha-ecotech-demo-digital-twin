<template>
  <div class="dashboard-minimap">
    <div class="minimap-panel">
      <div class="minimap-header">
        <div class="minimap-title">미니맵</div>
      </div>
      <div class="minimap-body">
        <!-- 원본 export의 mask-group0.svg가 0바이트 빈 파일이라 씬 항공뷰 썸네일로 대체한다 -->
        <img
          class="minimap-image"
          src="@/assets/images/screen-16/minimap-map.png"
          alt="야드 미니맵"
        />
      </div>
      <div class="minimap-toolbar">
        <div class="minimap-toolbar-spacer" />
        <div class="minimap-tool-button">
          <img
            class="minimap-tool-icon"
            src="@/assets/images/screen-16/frame-11712769951.svg"
            alt=""
          />
        </div>
        <div class="minimap-tool-button">
          <img
            class="minimap-tool-icon"
            src="@/assets/images/screen-16/frame-11712769952.svg"
            alt=""
          />
        </div>
        <div class="minimap-tool-button">
          <img
            class="minimap-tool-icon"
            src="@/assets/images/screen-16/frame-11712769953.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-minimap {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.minimap-panel {
  position: absolute;
  top: 130px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  justify-content: flex-start;
  width: 300px;
  height: 180px;
  overflow: hidden;
  pointer-events: auto;
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid #555555;
  border-radius: 4px;
}

.minimap-header {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  width: 300px;
  height: 30px;
  padding: 10px;
  overflow: hidden;
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid #555555;
  border-radius: 4px;
}

.minimap-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 16.5px;
  color: #d1d5dc;
  text-align: left;
}

.minimap-body {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  height: 100px;
}

.minimap-image {
  flex-shrink: 0;
  width: 298px;
  height: 100px;
  object-fit: cover;
}

.minimap-toolbar {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  align-self: stretch;
  height: 50px;
  padding: 10px;
}

.minimap-toolbar-spacer {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 3px;
  align-items: flex-end;
  justify-content: center;
  width: 160px;
  height: 37px;
}

.minimap-tool-button {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 10px;
  background: #555555;
  border: 1px solid #777777;
  border-radius: 8px;
}

.minimap-tool-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  overflow: visible;
}
</style>
