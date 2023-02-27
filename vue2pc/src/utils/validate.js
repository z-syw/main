/**
 * 判断传入path是否为外部链接地址
 * @param {string} path
 * @returns {Boolean} 如果是返回true
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 正则校验手机号
export function validMobile(str) {
  return /^1[3-9]\d{9}$/.test(str)
}
