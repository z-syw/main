// 使用require提供的context函数，加载某一个目录下的所有.vue后缀的文件
// 然后context函数会返回一个导入函数importFn
// 它又有一个属性keys()可以获取所有的文件路径，形成一个数组
// 再使用importFn根据文件路径形成的数组进行遍历，导入组件对象
// 遍历的同时进行全局注册
// 最后因为这里是使用插件进行全局组件注册，所以需要在mian.js中进行导入并使用Vue.use()进行注册
const importFn = require.context('./', false, /\.vue$/)
// Vue.use()会自动调用install方法
// Vue.use()：https://v2.cn.vuejs.org/v2/api/#Vue-use
const components = {
  install(Vue) {
    importFn.keys().forEach(key => {
      const component = importFn(key).default
      Vue.component(component.name, component)
    })
  }
}
export default components
