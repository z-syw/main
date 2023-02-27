import { MsgType, PrescriptionStatus } from '@/enums'
import type { Consult, Image } from './consult'
import type { Patient } from './user'

// 聊天-查询历史聊天记录
export type TimeMessages = {
  sid: string // 绘话id-socket链接id
  orderId: string // 订单id-关联业务id
  createTime: string // 绘话时间
  items: Message[]
}
export type Message = {
  id: string // 聊天消息id
  from?: string // 发送人
  to?: string // 接收人
  // 消息的类型1文字
  // 21卡片-患者病情 22卡片-处方信息 23未提交评价24已提交评价
  // 31通知-普通通知（白底黑色）32通知-温馨提示33通知-订单取消（灰色底黑字）4图片
  msgType: MsgType
  // 聊天内容信息
  msg: {
    // msgType为21 卡片-患者病情
    consultRecord?: Consult & {
      patientInfo: Patient
    }
    prescription?: Prescription // msgType为22-处方信息-cardType为2有值
    content?: string // 文本类型内容-msgType为1或者3
    picture?: Image // msgType为4
    evaluateDoc?: EvaluateDoc // msgType为24-卡片已提交评论
  }
  fromAvatar?: string // 发送人头像
  toAvatar?: string // 接收人头像
  createTime: string
  notScroll?: boolean
}
export type Prescription = {
  id: string
  orderId: string
  createTime: string
  name: string
  recordId: string
  gender: 0 | 1
  genderValue: ''
  age: number
  diagnosis: string
  status: PrescriptionStatus
  medicines: Medical[]
}
export type EvaluateDoc = {
  id?: string
  score?: number
  content?: string
  createTime?: string
  creator?: string
}
export type Medical = {
  id: string
  name: string
  amount: string
  avatar: string
  specs: string
  usageDosag: string
  quantity: string
  prescriptionFlag: 0 | 1
}
