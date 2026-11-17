import { createApp } from 'vue'

import { createAppPinia } from '@/shared/stores/pinia'
import { useSessionStore } from '@/shared/stores/session'
import TabletApp from '@/tablet-app.vue'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import '@/assets/tablet.css'

const TABLET_LOGIN_URL = `${import.meta.env.BASE_URL}#/login?redirect=/tablet`

/** 로그인하지 않았으면 메인 앱의 로그인 화면으로 보낸다. iframe 안이면 바깥 창을 이동한다. */
function redirectToLogin() {
  try {
    window.top!.location.replace(TABLET_LOGIN_URL)
  } catch {
    window.location.replace(TABLET_LOGIN_URL)
  }
}

const app = createApp(TabletApp)
const pinia = createAppPinia()

app.use(pinia)

// tablet.html은 라우터 가드를 거치지 않으므로 진입점에서 로그인 여부를 직접 확인한다.
if (useSessionStore(pinia).isLoggedIn) {
  app.mount('#app')
} else {
  redirectToLogin()
}
