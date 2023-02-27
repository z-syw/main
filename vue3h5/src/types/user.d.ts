// 用户信息
export type User = {
  token: string
  id: string
  account: string
  mobile: string
  avatar: string
}

// 短信验证码类型，登录|注册|修改手机号|忘记密码|绑定手机号
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'

// 个人信息
type OmitUser = Omit<User, 'token'>
type UserInfo = OmitUser & {
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}

// 问诊-查询患者列表信息
export type Patient = {
  name: string
  idCard: string
  defaultFlag: 0 | 1
  gender: 0 | 1
  genderValue?: string
  age?: number
  id?: string
}
