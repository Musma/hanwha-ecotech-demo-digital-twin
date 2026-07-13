<script setup lang="ts">
import { useRouter } from 'vue-router'

import LoginView from '@/features/public/components/login-view.vue'
import StageViewport from '@/shared/components/stage-viewport.vue'

const router = useRouter()

const handleLogin = () => {
  router.push('/dashboard')
}
</script>

<template>
  <StageViewport>
    <LoginView @login="handleLogin" />
  </StageViewport>
</template>
