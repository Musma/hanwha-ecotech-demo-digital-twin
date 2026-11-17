import { createApp } from 'vue'

import { redirectToLogin } from '@/shared/helpers/login-redirect'
import { createAppPinia } from '@/shared/stores/pinia'
import { useSessionStore } from '@/shared/stores/session'
import TabletApp from '@/tablet-app.vue'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import '@/assets/tablet.css'

const app = createApp(TabletApp)
const pinia = createAppPinia()

app.use(pinia)

// tablet.html은 라우터 가드를 거치지 않으므로 진입점에서 로그인 여부를 직접 확인한다.
if (useSessionStore(pinia).isLoggedIn) {
  app.mount('#app')
} else {
  redirectToLogin('/tablet')
}
