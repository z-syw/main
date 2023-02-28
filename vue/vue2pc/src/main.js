import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import 'normalize.css/normalize.css' // 重置样式库，处理各个浏览器默认样式不一样
import '@/styles/index.scss' // 公用样式
import '@/permission' // 路由守卫
import '@/icons'
import ELEMENT from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as directives from '@/directives' // 将一个模块中的全部按需导出，都导入进来
import components from '@/components'
import Print from 'vue-print-nb'

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

Vue.use(components)
Vue.use(ELEMENT)
Vue.use(Print)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// 往原型上加了一个方法，将来所有的组件实例，自己没有，就会去原型上找，就会找到这个sayHi
// Vue.prototype.sayHi = function() {}
// 组件中使用：this.sayHi()

// https://shuiruohanyu.gitee.io/yyds/document/
