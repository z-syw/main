import type { ConsultType, IllnessTime, OrderType } from '@/enums'
import type { Patient } from './user'

// 首页-查询推荐/减脂/饮食健康/关注页面--百科文章列表
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'
export type Knowledge = {
  title: string
  id: string
  coverUrl: string[]
  topics: string[]
  collectionNumber: number
  commentNumber: number
  creatorName: string
  creatorAvatar: string
  creatorHospatalName: string
  creatorDep: string
  creatorTitles: string
  likeFlag: 0 | 1
  content: string
  creatorId: string
}
export type KnowledgeList = Knowledge[]
export type KnowledgePage = {
  pageTotal: number
  total: number
  rows: KnowledgeList
}
export type KnowledgeParams = {
  type: KnowledgeType
  current: number
  pageSize: number
}

// 首页-关注的医生列表
export type PageParams = {
  current: number
  pageSize: number
}
export type Doctor = {
  id: string
  name: string
  avatar: string
  hospitalName: string
  gradeName: string
  depName: string
  positionalTitles: string
  likeFlag: 0 | 1
  serviceFee: number
  consultationNum: number
  score: number
  major: string
}
export type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}
export type DoctorList = Doctor[]

// 关注 - 关注操作，请求参数(医生|文章|百科话题|疾病)
export type FollowType = 'doc' | 'knowledge' | 'topic' | 'disease'

// 找医生--查询所有科室-层级
export type SubDep = {
  id: string
  name: string
}
export type TopDep = SubDep & {
  child: SubDep[]
}

// 问诊-保存/修改问诊订单
export type Image = {
  id: string
  url: string
}
export type Consult = {
  id: string
  type: ConsultType
  couponId: string
  illnessType: 0 | 1
  patientId: string
  depId: string
  illnessDesc: string
  illnessTime: IllnessTime
  consultFlag: 0 | 1
  pictures: Image[]
}
export type PartialConsult = Partial<Consult>
export type ConsultIllness = Pick<PartialConsult, 'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'>

// 问诊-支付页面-计算就诊信息和抵扣信息
export type CounsultOrderPreParams = Pick<PartialConsult, 'type' | 'illnessType'>
export type ConsultOrderPreData = {
  payment: number
  pointDeduction: number
  couponDeduction: number
  couponId: string
  actualPayment: number
}

// 问诊-查询订单详情信息-找医生、极速问诊和开药问诊
export type ConsultOrderItem = Consult & {
  createTime: string
  docInfo?: Doctor
  patientInfo: Patient
  orderNo: string
  status: OrderType
  statusValue: string
  typeValue: string
  countdown: number
  prescriptionId?: string
  evaluateId: number
  payment: number
  couponDeduction: number
  pointDeduction: number
  actualPayment: number
}

// 问诊记录-订单列表-找医生、极速问诊、开药问诊
export type ConsultOrderListParams = PageParams & {
  type: ConsultType
}
export type ConsultOrderPage = {
  pageTotal: number
  total: number
  rows: ConsultOrderItem[]
}
