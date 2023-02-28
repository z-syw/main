import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken() || '',
  userInfo: {}
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, payload) {
    state.userInfo = payload
  },
  removeUseInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  async login(context, data) {
    const token = await login(data)
    context.commit('setToken', token)
  },
  // // login方法得到一个异步操作
  // login(context, data) {
  //   // 发送请求进行登录，是一个异步操作，希望在异步操作结束后，做后续操作
  //   return new Promise((resolve, reject) => {
  //     // 这是一个异步操作，是一个整体
  //     login(data).then(data => {
  //       context.commit("setToken", data)
  //       resolve()
  //     }).catch(() => { reject() })
  //     // 这是一个异步操作，是一个整体
  //   })
  // },

  // 获取用户资料在哪调用？
  // 对于不同的用户角色，将来需要有不同的菜单展示，应该在一准备要进入到页面，就获取用户信息，要等用户信息获取完了，再让你完全进页面
  // 所以，要放在全局前置守卫中获取用户信息，将来会基于这个用户信息控制页面的展示路由
  // async函数执行的结果，默认就是一个Promise对象
  async getUserInfo(context) {
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result // 返回页面权限点
  },
  // getUserInfo(context) {
  //   return new Promise((resolve, reject) => {
  //     getUserInfo().then(data => {
  //       context.commit('setUserInfo', data)
  //       resolve(data)
  //     })
  //   })
  // },

  // 退出登录
  async logout(context) {
    context.commit('removeToken')
    context.commit('removeUseInfo')
    resetRouter() // 重置路由
    // 设置权限模块下路由为初始状态
    // vuex子模块怎么调用子模块的action
    // 都没加锁的情况下，可以随意调用（因为不加命名空间，所有的mutations和actions都是挂在全局上的，所以可以直接用）
    // 但是加了命名空间的子模块，怎么调用另一个加了命名空间的子模块的mutaitons
    // 加了命名空间的子模块，context指的不在是全局的context
    // context(参数一：，参数二：载荷，参数三：{root: true}调用根级别的mutations或者actions)
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
