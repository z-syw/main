import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import settings from './modules/settings'
import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { app, settings, user, permission },
  getters // 全局getters
})

export default store
