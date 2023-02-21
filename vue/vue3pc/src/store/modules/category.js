import { topCategory } from '@/api/constances'
import { findAllCategory } from '@/api/category'

export default {
  namespaced: true,
  state: () => {
    return {
      list: topCategory.map(item => ({ name: item }))
    }
  },

  mutations: {
    // 设置分类
    setList: (state, payload) => (state.list = payload),

    // 定义show和hide函数，控制二级分类显示和隐藏
    show: (state, id) => {
      // 用户选择的那个id等于数据中的id，就找到了当前分类
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide: (state, id) => {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = false
    }
  },

  actions: {
    // 获取分类
    getList: async ({ commit }) => {
      const data = await findAllCategory()
      // 由于是单页面，路由跳转不会刷新页面，css的hover一直触发，无法关闭分类弹窗，所以不要用hover控制显示隐藏
      // 那怎么控制？通过数据控制，可以通过一个布尔值进行判断
      // 给每个一级分类加上控制显示隐藏菜单的数据
      // 然后通过一个显示隐藏的类名进行控制
      data.result.forEach(item => (item.open = false))
      commit('setList', data.result)
    }
  }
}
