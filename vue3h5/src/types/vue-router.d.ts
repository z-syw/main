import 'vue-router'

declare module 'vue-router' {
  // type和interface的区别: interface可以扩展
  // interface: 一般用于第三方包的扩展，第三方包不知道我需要用哪些字段，只能自己来扩展类型
  interface RouteMeta {
    title?: string // 每个页面不一定都有title所以是可选的
  }
}
