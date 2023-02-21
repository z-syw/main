import store from '@/store'
import router, { asyncRoutes } from '@/router'
import getPageTitle from '@/utils/get-page-title'
import nprogress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
nprogress.configure({ showSpinner: false }) // 关闭进度环
const whiteList = ['/login', '/404'] // 白名单

router.beforeEach(async(to, from, next) => {
  const token = store.getters.token
  nprogress.start()
  if (token) {
    if (to.path === '/login') {
      next('/') // 有token，且访问的是登录页，跳到主页
    } else {
      // next() // 有token，访问的不是登录页，放行
      if (!store.getters.userId) {
        // 有token，并且要访问的不是登录页，需要先获取用户资料，再放行
        // 但是不是每次访问都要获取用户资料，如果vuex里有用户资料，就不需要获取了，没有再去获取
        const { roles } = await store.dispatch('user/getUserInfo')
        // 把所有准备好的路由规则对象，取出看看名字和menus里是否匹配，匹配就证明此登陆的用户有这个页面的访问权限，让filter收集此路由规则对象到新数组里
        const filterList = asyncRoutes.filter(item =>
          roles.menus.includes(item.children[0].name.toLowerCase())
        )
        router.addRoutes([
          ...filterList,
          {
            path: '*',
            component: () => import('@/views/404.vue'),
            hidden: true
          }
        ])
        store.commit('permission/setRoutes', filterList)
        // 路由在跳转一次，因为上面next()会导致白屏，因为放行时，动态路由还咩有加入到内存中路由表里
        next({
          path: to.path, // 保证路由添加完了再进入页面（可以理解为重进一次）
          replace: true // 不在回退，类似于this.$router.replace()
        })
      }
      next() // 有token，访问的不是登录页，放行
    }
  } else {
    if (whiteList.includes(to.path)) {
      next() // 没有token，要去的地址在白名单，放行
    } else {
      next('/login') // 没有token，要去的地址不在白名单，跳到登录页
    }
  }
  nprogress.done()
})

// 后置守卫不需要next
// 一旦在前置守卫中做了拦截，拦截到了其它页面，那么后置守卫不会被触发
// 所以进度条没有关闭，解决方案：如果在前置守卫做了拦截，就需要手动关闭
router.afterEach((to, from) => {
  document.title = getPageTitle(to.meta.title) // 动态设置浏览器顶部标题
  nprogress.done()
})
