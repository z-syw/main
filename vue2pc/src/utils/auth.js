import Cookies from 'js-cookie'
const TokenKey = 'houtai-token-key'

// 获取 localStorage.getItem(name)
// 设置 localStorage.setItem(name, value)
// 删除 localStorage.removeItem(name)

// 后台返回的token就是字符串，所以可以直接存

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
