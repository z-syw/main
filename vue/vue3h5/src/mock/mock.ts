import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const rules: MockMethod[] = [
  // 一个对象就是一个接口
  {
    url: 'member/collect/', // 请求地址
    method: 'get', // 请求方式
    timeout: 1000, // 超时时间
    // 响应数据（JSON）
    response: () => {
      const data = []
      for (let i = 0; i < 10; i++) {
        data.push(
          Mock.mock({
            id: '@id',
            avatar: '@image("100x100")',
            title: '@ctitle(3,10)',
            lastContent: '@ctitle(10,40)',
            sendTime: '@datetime()'
          })
        )
      }
      // 在函数里返回前台需要的数据
      return {
        code: 10000,
        message: '获取数据成功',
        data: data
      }
    }
  }
]

export default rules
