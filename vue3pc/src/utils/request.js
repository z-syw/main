import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 创建一个新的axios实例，进行二次封装，然后导出，提供给逻辑页面调用
// export const baseURL = 'https://apipc-xiaotuxian-front.itheima.net'
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net'
// axios对象提供的方法create，创建一个新的axios实例，instance就相当于axios
const instance = axios.create({ baseURL, timeout: 5000 })

instance.interceptors.request.use(
  // 在请求拦截器里判断是否有token，如果有token，携带在头部
  // config：配置对象，对象里面有一个属性很重要，heades请求头
  config => {
    const { profile } = store.state.user // 获取用户信息对象
    if (profile.token) config.headers.Authorization = `Bearer ${profile.token}`
    return config
  },
  err => Promise.reject(err) // 拦截失败后的操作
)

instance.interceptors.response.use(
  // 响应成功的回调，在这里剥离无效数据
  // axios默认包裹了一层{data: {…}, status: 200, statusText: 'OK', headers: AxiosHeaders, config: {…}}
  res => res.data,
  // 响应失败的回调，在这里401状态码代表token失效(没有通过服务端校验)，在响应拦截器里处理
  err => {
    // 为什么有两个判断？后台有时候不给响应
    if (err.response && err.response.status === 401) {
      store.commit('user/setUser', {}) // 清空无效用户信息
      // 跳转到登录页并且传递'当前路由地址'参数给登录页，用户重新登录时，可以回调页面
      // 在组件中怎么拿到当前路由地址：$route.fullPath拿到完整地址；$route.path拿不到问号后面的地址
      // 在js中怎么拿到当前路由地址：router.currentRoute.fullPath
      // $route === router.currentRoute当前路由对应的路由信息对象
      // 坑：虽然在js中拿到了路由地址，但是已经是一个ref响应式的数据
      // 坑：地址有特殊字符(&)，query解析可能会有问题，所以需要转码encodeURIComponent
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      router.push(`/login?redirectUrl=${fullPath}`)
    }
    return Promise.reject(err)
  }
)

export default (url, method, submitData) =>
  instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
