import Vue from 'vue'
import Layout from '@/layout'
import Router from 'vue-router'
Vue.use(Router)

// 导入动态路由
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import departmentsRouter from './modules/departments'
import settingRouter from './modules/setting'
// 导出动态路由
export const asyncRoutes = [
  departmentsRouter,
  settingRouter,
  employeesRouter,
  permissionRouter
]

// 路由懒加载
const Login = () => import('@/views/login')
const Import = () => import('@/views/import')
const Dashboard = () => import('@/views/dashboard')

// 静态路由
export const constantRoutes = [
  { path: '/login', component: Login, hidden: true },

  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/import',
    component: Layout,
    hidden: true,
    children: [{ path: '', component: Import }]
  }
]

const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })
const router = createRouter()

// 在登出的时候调用该方法，重置路由，重新设置路由的可匹配路径
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
