import axios, { type Method } from 'axios'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import router from '@/router'

// 新axios实例，基础配置(基础地址，超时时间)
const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({ baseURL, timeout: 5000 })

// 请求拦截器，携带token
// 什么是jwt身份认证？是一个基于token令牌的身份认证机制
// 登录请求后，后台返回token，前端该如何操作？将token存储于本地，下次请求时在请求头中携带
// 在前后端分离模式的开发中，服务器如何知道来访者的身份呢？基于token令牌，包含身份信息的字符串
instance.interceptors.request.use(
  config => {
    const store = useUserStore()
    if (store.user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${store.user?.token}`
    }
    return config
  },
  err => Promise.reject(err)
)

// 响应拦截器，剥离无效数据，401拦截
// axios默认包裹了一层{data: {…}, status: 200, statusText: 'OK', headers: AxiosHeaders, config: {…}}
instance.interceptors.response.use(
  // 2xx范围内的状态码都会触发该函数
  res => {
    // 后台约定，响应成功，但是code不是10000，是业务逻辑失败
    // 状态码status是200是响应成功的，res.data.code是10000是业务成功
    if (res.data.code !== 10000) {
      showToast(res.data.message)
      return Promise.reject(res.data) // 不成功终断程序
    }
    return res.data // 业务逻辑成功，返回响应数据，作为axios成功的结果
  },

  // 超出2xx范围的状态码都会触发该函数
  err => {
    if (err.response.status === 401) {
      const store = useUserStore()
      store.delUser() // 删除用户信息
      // 跳转登录，带上接口失效所在页面的地址，登录完成后回跳使用。login?returnUrl=回调地址
      router.push({
        path: '/login',
        query: { returnUrl: router.currentRoute.value.fullPath }
      })
    }
    return Promise.reject(err)
  }
)

// submitData?传递给后台的数据，是个对象，有时候后台不需要传，所以可选
const request = <T>(url: string, method: Method = 'GET', submitData?: object) => {
  // 使用TS的时候，axios()调用需要改为axios.request()，可以使用泛型
  // 使用泛型的目的的告诉axios返回数据的类型如何
  // 泛型的类型需要和接口返回的一致，否则无意义
  // 泛型的第二个参数，可以自定义响应式数据类型
  return instance.request<T, { code: number; message: string; data: T }>({
    url: url,
    method: method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}

export { request, baseURL, instance }
