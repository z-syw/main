export default {
  namespaced: true,
  state: () => {
    return {
      profile: {},
      redirectUrl: '/'
    }
  },

  mutations: {
    setUser: (state, payload) => (state.profile = payload),
    setRedirectUrl: (state, url) => (state.redirectUrl = url)
  }
}

// Vuex的状态是响应式的，当Vue组件从store中读取状态时，若store中的状态（数据）发生变化，那么相应组件也会变化
