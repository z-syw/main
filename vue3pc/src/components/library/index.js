// 插件：扩展vue原有的功能 -> 全局组件，自定义指令，挂载原型方法...
// vue2写法：导出一个对象，有install函数，默认传入了vue构造函数，在vue基础上进行扩展
// vue3写法：导出一个对象，有install函数，默认传入了app应用实例，在app基础上进行扩展
// vue/app提供component/directive...函数

import Message from './Message'
import Confirm from './Confirm'
import defaultImg from '@/assets/images/200.png'

const importFn = require.context('./', false, /\.vue$/)

// 暴露给main.js使用，app.use()会执行install方法。
export default {
  install(app) {
    importFn.keys().forEach(item => {
      const component = importFn(item).default
      const name = component.name ? component.name : component.__name
      app.component(name, component)
    })

    // vue3使用app.config.globalProperties挂载原型方法
    // 挂载全局的属性，能够通过组件实例调用的属性(this.$message)
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm

    // 图片懒加载原理：当图片进入可视区内去加载图片，给图片设置src属性（图片设置src属性，会发请求）
    app.directive('lazy', {
      // 页面加载完成之后（使用指令的DOM是否创建好）
      // Vue2.0使用inserted；Vue3.0使用mounted(组件中使用onMounted)
      mounted(el, binding) {
        // 创建一个观察对象，观察使用当前指令的元素
        const observe = new IntersectionObserver(
          ([{ isIntersecting }]) => {
            if (isIntersecting) {
              observe.unobserve(el) // 停止观察
              // 加载失败，设置默认图片。onerror图片加载失败，load图片加载成功。
              el.onerror = () => {
                el.src = defaultImg
              }
              el.src = binding.value // 把指令的值，设置给元素的src属性
            }
          },
          { threshold: 0 }
        )
        observe.observe(el) // 开始观察
      }
    })
  }
}
