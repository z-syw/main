// 在vuex中，在静态路由的基础上，去存储动态路由
import { constantRoutes } from '@/router' // 导入静态路由表

const state = () => {
  return {
    routes: constantRoutes // 默认静态路由
  }
}

const mutations = {
  // 设置动态路由方法
  // 将动态路由和静态路由组合起来，每次都是在静态路由的基础上，去存储动态路由
  // newRoutes认为是我们登录成功需要存储的动态路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
