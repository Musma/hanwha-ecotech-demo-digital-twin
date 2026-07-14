<script setup lang="ts">
import AppTopbar from '@/shared/components/app-topbar.vue'
</script>

<template>
  <div
    class="tablet-app flex h-screen w-full overflow-hidden bg-hw-white-lighter text-hw-gray-darker"
  >
    <div class="flex min-w-0 flex-1 flex-col">
      <AppTopbar />
      <main
        class="main-scroll-style min-h-0 flex-1 overflow-auto bg-hw-white-lighter"
      >
        <slot />
      </main>
    </div>
  </div>
</template>
