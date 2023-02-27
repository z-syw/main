import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

const service = axios.create({
  // process.env就是在访问环境变量，是webpack内置的语法，在打包时，会解析处理，按照环境变量替换
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(
  // 在发送请求之前做些什么
  config => {
    // 如果有token，把token携带在请求头上(表明自己身份)
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须要返回的，return到axios源码内部
  },
  // 对请求错误做些什么
  error => Promise.reject(error) // 等价于new Promise((resolve,reject) => {reject(error)})
)

service.interceptors.response.use(
  // 对响应数据做点什么 处理状态码成功的情况
  response => {
    // 一旦发现success为false，就在响应拦截器中抛出错误，不让走.then了
    const { success, message, data } = response.data
    if (success === false) {
      Message.error(message)
      // 这里需要抛出一个错误的promise，让代码走.catch
      return Promise.reject(new Error(message))
      // 等价于
      // return new Promise((resolve, reject) => {
      //   reject(new Error(message))
      // })
    }
    return data
  },
  // 对响应错误做点什么 处理4/5开头的状态码
  error => {
    // 可以用http状态码来判断，也可以用code状态码来判断token
    // ?.可选链操作符，需要babel支持，webpack默认babel支持；左侧有值才会继续往下执行，防止空值去点任意的属性报错
    if (error?.response?.data?.code === 10002) {
      store.dispatch('user/logout')
      router.replace(`/login?redirect=${router.currentRoute.fullPath}`)
      Message.error(error.response.data.message + ' ' + '请重新登录')
    }
    return Promise.reject(error)
  }
)

export default service
