import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

// import 'xxx' 纯业务模块，不对外暴露成员，但需要项目一启动就执行
import 'virtual:svg-icons-register' // 打包svg图标
import 'vant/lib/index.css' // vant全局样式
import './styles/main.scss' // 公用样式

const app = createApp(App) // 根据App根组件创建一个应用实例
// 在Vue3中使用createApp执行Vue的初始化，另外不管是Vue生态里的东西，还是外部插件、UI框架，统一都是由use()进行激活，非常统一和简洁
app.use(pinia)
app.use(router)
app.mount('#app') // 把app应用实例挂载到index.html的#app容器里

// 什么是组件？组件就是一个可以复用的普通js对象

// 怎么理解localhost:8080
// 项目里的各个组件已经做好了关联，但是需要一个平台去呈现，当打开localhost:8080之后就会去走入口文件
// 这里的入口文件相当于index.html

// 怎么理解node
// node是js的运行环境，node可以让前端去创建服务器，一般服务器由后端去写，但是node学习成本低（因为node走的js），适合前端
// localhost:8080就是由node做支持

// http://zhoushugang.gitee.io/erabbit-client-pc-document/
// https://zhoushugang.gitee.io/patient-h5-note/
// https://cp_fe.gitee.io/course-advance/#/
// http://vue3.chengpeiquan.com/

// package.json
// dependencies：上线环境，打包后，包含这里的源码
// devDependencies：开发环境，打包后，不包含这里的源码

// publie
// 此目录下的所有文件在打包后，会直接放到 dist 目录下

// src/assets
// 静态资源

// npm install 下载的是 package.json 里的依赖，下载到了 node_modules 文件夹
