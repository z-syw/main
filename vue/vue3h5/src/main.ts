// 引入的不再是vue构造函数，而是一个名为createApp的工厂函数。区别就是：构造函数需要new调用；工厂函数不需要new调用
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

// import 'xxx' 纯业务模块，不对外暴露成员，但需要项目一启动就执行
import 'virtual:svg-icons-register' // 打包svg图标
import 'vant/lib/index.css' // vant全局样式
import './styles/main.scss' // 公用样式

// 创建应用实例对象app，类似于之前的vm，但是比vm'轻'
const app = createApp(App)
app.use(pinia)
app.use(router)
// 应用实例对象上有个方法mount，挂载
app.mount('#app')
