<template>
  <div class="dashboard-status-bar">
    <div class="status-bar-column">
      <div class="status-bar-spacer" />
      <div class="status-bar">
        <div class="status-left">
          <div class="server-status">
            <div class="server-label">Server :</div>
            <div class="server-dot" />
            <div class="server-state">Connected</div>
          </div>
          <div class="version-wrap">
            <div class="version-label">Ver.1.0.0</div>
          </div>
        </div>
        <div class="log-console">
          <div class="log-text-wrap">
            <div class="log-text">
              [16:42:47] [LogDebug] Analyzing input parameters for requested
              module.
            </div>
          </div>
          <img
            class="log-icon"
            src="@/assets/images/screen-16/icon0.svg"
            alt=""
          />
        </div>
        <div class="status-right">
          <div class="datetime-label">2026.01.01 00:00:00</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-status-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.status-bar-column {
  position: absolute;
  bottom: 0;
  left: 50%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
  justify-content: flex-end;
  width: 1920px;
  translate: -50%;
}

.status-bar-spacer {
  position: relative;
  flex-shrink: 0;
  width: 600px;
  height: 206px;
}

.status-bar {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  height: 40px;
  pointer-events: auto;
  background: #1e1e1e;
}

.status-left {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 20px;
  align-items: center;
  justify-content: flex-start;
  width: 660px;
  padding: 0 10px;
}

.server-status {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 3px;
  align-items: center;
  justify-content: flex-start;
}

.server-label,
.server-state {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.5px;
  color: #d1d5dc;
  text-align: right;
}

.server-dot {
  position: relative;
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  background: #00c950;
  border-radius: 50%;
}

.version-wrap {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.version-label {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.5px;
  color: #d1d5dc;
  text-align: right;
}

.log-console {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  width: 600px;
  height: 34px;
  padding: 0 8px;
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid #555555;
  border-radius: 4px;
}

.log-text-wrap {
  position: relative;
  flex-shrink: 0;
  width: 560px;
  height: 24px;
}

.log-text {
  position: absolute;
  top: 50%;
  left: 0;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 16.5px;
  color: #ffffff;
  text-align: left;
  translate: 0 -50%;
}

.log-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  overflow: visible;
}

.status-right {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  width: 660px;
  padding: 0 10px;
}

.datetime-label {
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.5px;
  color: #d1d5dc;
  text-align: right;
}
</style>
