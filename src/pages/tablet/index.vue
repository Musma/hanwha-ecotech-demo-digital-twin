<script setup lang="ts">
const tabletEntryUrl = `${import.meta.env.BASE_URL}tablet.html`
</script>

<template>
  <iframe
    class="tablet-service-frame"
    :src="tabletEntryUrl"
    title="물류 디지털 트윈 태블릿 서비스"
    aria-label="물류 디지털 트윈 태블릿 서비스"
  />
</template>

<style scoped lang="scss">
.tablet-service-frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #f4f6f9;
}
</style>
