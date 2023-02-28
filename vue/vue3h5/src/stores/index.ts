// 抽离封装pinia
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate' // 持久化
const pinia = createPinia() // 创建Pinia的实例（对象）
pinia.use(persist)
export default pinia // 导出pinia实例，给main使用

// 完整写法
// import { useUserStore } from './user'
// export { useUserStore }
export * from './user'
export * from './consult'
