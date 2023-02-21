import { request } from '@/utils/request'
import type { CodeType, Patient, User, UserInfo } from '@/types/user'

// 登录--密码登录
export const loginByPasswordAPI = (mobile: string, password: string) =>
  request<User>('login/password', 'POST', { mobile, password })

//  获取手机验证码
export const sendMobileCodeAPI = (mobile: string, type: CodeType) => request('code', 'GET', { mobile, type })

// 登录--手机验证码登录
export const loginByMobileAPI = (mobile: string, code: string) =>
  request<User>('login', 'POST', { mobile, code })

// 登录--三方登录--qq三方登录
export const loginByQQAPI = (openId: string) =>
  request<User>('login/thirdparty', 'POST', { openId, source: 'qq' })

// 登录--绑定用户新-三方登录绑定手机号
export const bindMobileAPI = (data: { mobile: string; code: string; openId: string }) =>
  request<User>('login/binding', 'POST', data)

// 我的-获取个人用户信息
export const getUserInfoAPI = () => request<UserInfo>('patient/myUser', 'GET')

// 问诊-查询患者列表信息
export const getPatientListAPI = () => request<Patient[]>('/patient/mylist')

// 问诊-添加患者信息
export const addPatientAPI = (patient: Patient) => request('/patient/add', 'POST', patient)

// 问诊-编辑患者信息
export const editPatientAPI = (patient: Patient) => request('/patient/update', 'PUT', patient)

// 问诊-删除患者信息
export const delPatientAPI = (id: string) => request(`/patient/del/${id}`, 'DELETE')
