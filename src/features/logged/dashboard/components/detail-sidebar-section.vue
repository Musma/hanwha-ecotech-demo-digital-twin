<script lang="ts">
export interface DetailSidebarRow {
  label: string
  value: string
  tone?: 'white' | 'warning' | 'success' | 'danger'
}
</script>

<script setup lang="ts">
defineProps<{
  title: string
  rows: readonly DetailSidebarRow[]
}>()
</script>

<template>
  <section class="detail-sidebar-section">
    <div class="section-heading">
      <div class="section-title">{{ title }}</div>
    </div>
    <div
      class="section-rows"
      :style="{ height: `${20 + (rows.length - 1) * 32}px` }"
    >
      <template v-for="(row, index) in rows" :key="row.label">
        <div class="row-label-cell" :style="{ top: `${index * 32}px` }">
          <div class="row-label">{{ row.label }}</div>
        </div>
        <div class="row-value-cell" :style="{ top: `${index * 32}px` }">
          <div
            class="row-value"
            :class="row.tone ? `tone-${row.tone}` : undefined"
          >
            {{ row.value }}
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.detail-sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
  width: 279px;
  position: relative;
}

.section-heading {
  align-self: stretch;
  flex-shrink: 0;
  height: 20px;
  position: relative;
}

.section-title {
  color: #e5e7eb;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 14px;
  font-weight: 700;
  position: absolute;
  left: 0;
  top: 0;
}

.section-rows {
  flex-shrink: 0;
  width: 280px;
  position: relative;
}

.row-label-cell {
  width: 149.13px;
  height: 20px;
  position: absolute;
  left: 0;
  overflow: hidden;
}

.row-label {
  color: #888888;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  left: 0;
  top: 0;
}

.row-value-cell {
  width: 185.17px;
  height: 20px;
  position: absolute;
  left: 94.83px;
}

.row-value {
  color: #e5e7eb;
  text-align: left;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  left: 0;
  top: 0;

  &.tone-white {
    color: #ffffff;
  }

  &.tone-warning {
    color: #ed7100;
  }

  &.tone-success {
    color: #10b981;
  }

  &.tone-danger {
    color: #ef4444;
  }
}
</style>
