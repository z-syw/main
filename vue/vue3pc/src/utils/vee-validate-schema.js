import { userAccountCheck } from '@/api/user'

// vee-validate的校验规则函数
export default {
  // 用户名校验规则
  account(value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },
  // 用户校验并且校验唯一性
  async accountAPI(value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    // 服务端校验
    const data = await userAccountCheck(value)
    if (data.result.valid) return '用户名已存在'
    return true
  },
  // 密码校验规则
  password(value) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码格式6-24个字符'
    return true
  },
  // 确认密码
  rePassword(value, { form }) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码格式6-24个字符'
    if (value !== form.password) return '两次密码不一致'
    return true
  },
  // 手机号校验规则
  mobile(value) {
    if (!value) return '请输入手机号'
    // 规则：1开头，3-9之间9个数字
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式不对'
    return true
  },
  // 验证码校验规则
  code(value) {
    if (!value) return '请输入短信验证码'
    if (!/^\d{6}$/.test(value)) return '短信验证码6个数字'
    return true
  },
  // 用户协议校验规则
  isAgree(value) {
    if (!value) return '请勾选用户协议'
    return true
  }
}
