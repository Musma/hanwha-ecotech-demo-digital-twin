import { createApp } from 'vue'

import App from '@/app.vue'
import router from '@/router'
import { createAppPinia } from '@/shared/stores/pinia'
import '@/assets/main.scss'
import '@/assets/theme.scss'
import '@/assets/typography.scss'

const app = createApp(App)

app.use(createAppPinia())
app.use(router)

app.mount('#app')
