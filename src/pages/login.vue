<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

import LoginView from '@/features/public/components/login-view.vue'
import StageViewport from '@/shared/components/stage-viewport.vue'
import { useSessionStore } from '@/shared/stores/session'

const DEFAULT_REDIRECT_PATH = '/dashboard'

const route = useRoute()
const router = useRouter()
const session = useSessionStore()

/** 가드가 넘겨준 원래 경로가 앱 내부 경로일 때만 그곳으로 돌려보낸다. */
const resolveRedirectPath = () => {
  const redirect = route.query.redirect
  if (typeof redirect !== 'string') return DEFAULT_REDIRECT_PATH
  if (!redirect.startsWith('/') || redirect.startsWith('//')) {
    return DEFAULT_REDIRECT_PATH
  }
  return redirect
}

const handleLogin = () => {
  session.login()
  router.replace(resolveRedirectPath())
}
</script>

<template>
  <StageViewport>
    <LoginView @login="handleLogin" />
  </StageViewport>
</template>
