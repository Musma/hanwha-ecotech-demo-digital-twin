import { createApp } from 'vue'

import App from '@/app.vue'
import router from '@/router'
import { createAppPinia } from '@/shared/stores/pinia'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import '@/assets/main.scss'
import '@/assets/theme.scss'
import '@/assets/typography.scss'
import '@/assets/tablet.css'

const app = createApp(App)

app.use(createAppPinia())
app.use(router)

app.mount('#app')
