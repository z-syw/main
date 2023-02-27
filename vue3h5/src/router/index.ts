import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
// 头部导航条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false }) // 关闭转圈

const Room = () => import('@/views/Room/index.vue')
const User = () => import('@/views/User/index.vue')
const Home = () => import('@/views/Home/index.vue')
const Login = () => import('@/views/Login/index.vue')
const Layout = () => import('@/views/Layout/index.vue')
const ConsultDetail = () => import('@/views/User/ConsultDetail.vue')
const ConsultIllness = () => import('@/views/Consult/ConsultIllness.vue')
const OrderLogistics = () => import('@/views/Order/OrderLogistics.vue')
const OrderPayResult = () => import('@/views/Order/OrderPayResult.vue')
const LoginCallback = () => import('@/views/Login/LoginCallback.vue')
const ConsultFast = () => import('@/views/Consult/ConsultFast.vue')
const ConsultDep = () => import('@/views/Consult/ConsultDep.vue')
const ConsultPay = () => import('@/views/Consult/ConsultPay.vue')
const OrderDetail = () => import('@/views/Order/OrderDetail.vue')
const PatientPage = () => import('@/views/User/PatientPage.vue')
const ConsultPage = () => import('@/views/User/ConsultPage.vue')
const OrderPay = () => import('@/views/Order/OrderPay.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: '/home', component: Home, meta: { title: '首页' } },
        { path: '/user', component: User, meta: { title: '个人中心' } }
      ]
    },
    {
      path: '/room',
      component: Room,
      meta: { title: '问诊室' },
      beforeEnter(to) {
        if (to.query.payResult === 'false') return '/user/consult'
      }
    },
    { path: '/login', component: Login, meta: { title: '登录' } },
    { path: '/order/pay', component: OrderPay, meta: { title: '药品支付' } },
    { path: '/order/logistics/:id', component: OrderLogistics, meta: { title: '物流详情' } },
    { path: '/order/pay/result', component: OrderPayResult, meta: { title: '药品支付结果' } },
    { path: '/login/callback', component: LoginCallback, meta: { title: 'QQ登录-绑定手机' } },
    { path: '/consult/illness', component: ConsultIllness, meta: { title: '病情描述' } },
    { path: '/user/consult/:id', component: ConsultDetail, meta: { title: '问诊详情' } },
    { path: '/order/:id', component: OrderDetail, meta: { title: '药品订单详情' } },
    { path: '/user/consult', component: ConsultPage, meta: { title: '问诊记录' } },
    { path: '/user/patient', component: PatientPage, meta: { title: '家庭档案' } },
    { path: '/consult/fast', component: ConsultFast, meta: { title: '极速问诊' } },
    { path: '/consult/dep', component: ConsultDep, meta: { title: '选择科室' } },
    { path: '/consult/pay', component: ConsultPay, meta: { title: '问诊支付' } }
  ]
})

router.beforeEach(to => {
  NProgress.start()
  const store = useUserStore()
  const whiteList = ['/login', '/login/callback', '/register'] // 白名单，不需要登录就可以访问的页面
  // 若用户直接在地址栏中输入地址，去家庭档案页面，此时用户没有登录，没有token，就不让用户看到，让用户去登录页
  // 如果没有token且要去的地址不在白名单，去登录页
  if (!store.user?.token && whiteList.includes(to.path) === false) return '/login'
})

router.afterEach(to => {
  // 建议修改标题放在后置守卫 ，切换路由完成后修改标题
  document.title = `寻医问药|${to.meta.title || ''}`
  NProgress.done()
})

export default router
