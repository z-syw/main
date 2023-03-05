import { h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

// views
const Cart = () => import('@/views/cart')
const Home = () => import('@/views/home')
const Goods = () => import('@/views/goods')
const Login = () => import('@/views/login')
const Layout = () => import('@/views/Layout')
const MemberOrderDetail = () => import('@/views/member/order/detail')
const LoginCallback = () => import('@/views/login/callback')
const MemberLayout = () => import('@/views/member/Layout')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const MemberOrder = () => import('@/views/member/order')
const MemberHome = () => import('@/views/member/home')

// pages
const PLayout = () => import('@/pages/p-layout.vue')
const PEcharts = () => import('@/pages/p-echarts.vue')
const PCarousel = () => import('@/pages/p-carousel.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/cart', component: Cart },
      { path: '/product/:id', component: Goods },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      {
        path: 'member',
        component: MemberLayout,
        children: [
          { path: '', component: MemberHome },
          {
            path: 'order',
            // 创建一个RouterView容器，形成嵌套关系
            component: { render: () => h(<RouterView />) },
            children: [
              { path: '', component: MemberOrder },
              { path: ':id', component: MemberOrderDetail }
            ]
          }
        ]
      }
    ]
  },
  { path: '/login', component: Login },
  { path: '/login/callback', component: LoginCallback },

  // pages
  { path: '/p-layout', component: PLayout },
  { path: '/p-carousel', component: PCarousel },
  { path: '/p-echarts', component: PEcharts }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }) // 每次切换路由时，滚动到页面顶部
})

export default router
