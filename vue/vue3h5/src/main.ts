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

// 怎么理解localhost:8080
// 项目里的各个组件已经做好了关联，但是需要一个平台去呈现，当打开localhost:8080之后就会去走入口文件
// 这里的入口文件相当于index.html

// 怎么理解node
// node是js的运行环境，node可以让前端去创建服务器，一般服务器由后端去写，但是node学习成本低（因为node走的js），适合前端
// localhost:8080就是由node做支持

// https://zhoushugang.gitee.io/patient-h5-note/
// https://cp_fe.gitee.io/course-advance/#/
// http://vue3.chengpeiquan.com/
