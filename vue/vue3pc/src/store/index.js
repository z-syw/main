import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'

export default createStore({
  modules: { cart, user, category },
  plugins: [
    // 刷新页面，vuex数据会清空，所以做了持久化存储
    createPersistedstate({
      key: 'qiantai-key', // 本地存储的名字
      paths: ['user', 'cart'] // 指定需要存储的模块
    })
  ]
})
