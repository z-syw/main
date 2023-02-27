import request from '@/utils/request'

/**
 *  使用用户名密码登录
 * @param {string} data - 用户名和密码
 * @returns promise
 */
export const userAccountLogin = data => request('/login', 'POST', data)

// 获取手机号验证码
export const userMobileLoginMsg = data => request('/login/code', 'GET', data)

// 使用手机号验证码登录
export const userMobileLogin = data => request('/login/code', 'POST', data)

/**
 * 三方登录
 * @param {String} unionId 三方标识
 * @param {String} source 1为pc
 * @returns promise
 */
export const userQQLogin = data => request('/login/social', 'POST', data)

/**
 * 三方登录_发送已有账号短信
 * 获取QQ绑定时短信验证码
 * @param {string} mobile 手机号
 * @returns promise
 */
export const userQQBindCode = ({ mobile }) => request('/login/social/code', 'GET', { mobile })

/**
 * QQ三方登录_账号绑定
 * @param {String} unionId 三方标识
 * @param {String} mobile 手机号
 * @param {String} code 验证码
 * @returns promise
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => request('/login/social/bind', 'POST', { unionId, mobile, code })

/**
 * 注册-校验用户名唯一
 * @param {String} account 账号
 * @returns promise
 */
export const userAccountCheck = account => request('/register/check', 'GET', { account })

/**
 * 获取短信验证码-注册-PC
 * @param {String} mobile 手机号
 * @returns promise
 */
export const userQQPatchCode = mobile => request('/register/code', 'GET', { mobile })

/**
 * 三方登录-完善信息
 * @param {String} account mobile code password
 * @returns promise
 */
export const userQQPatchLogin = ({ account, mobile, code, password, unionId, rePassword }) => request(`/login/social/${unionId}/complement`, 'POST', { account, mobile, code, password, rePassword })
