import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import components from '@/components/library' // 全局共用组件
import 'normalize.css' // 没有直接清除掉所有样式，而是将默认样式统一，这样在所有的浏览器中默认样式都一样了
import '@/assets/styles/common.less' // 公用样式
import '@/mock' // mockjs

// 导入App根组件，挂载到#app容器中
createApp(App).use(store).use(router).use(components).mount('#app')
// http://zhoushugang.gitee.io/erabbit-client-pc-document/
// 什么是组件？组件就是一个可以复用的普通js对象
