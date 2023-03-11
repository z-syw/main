import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/style/reset.scss'
import '@/assets/style/common.scss'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
