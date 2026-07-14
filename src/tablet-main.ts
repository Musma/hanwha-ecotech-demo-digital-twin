import { createApp } from 'vue'

import { createAppPinia } from '@/shared/stores/pinia'
import TabletApp from '@/tablet-app.vue'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import '@/assets/tablet.css'

const app = createApp(TabletApp)

app.use(createAppPinia())

app.mount('#app')
