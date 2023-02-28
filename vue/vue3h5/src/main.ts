import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

// import 'xxx' 纯业务模块，不对外暴露成员，但需要项目一启动就执行
import 'virtual:svg-icons-register' // 打包svg图标
import 'vant/lib/index.css' // vant全局样式
import './styles/main.scss' // 公用样式

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
