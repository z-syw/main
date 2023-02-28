import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 获取员工基本信息
export function getUserDetailById(id) {
  return request({
    // 路径参数，把id值带在路径上传递给后台
    url: `/sys/user/${id}`
  })
}
