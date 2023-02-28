import type { ExpressStatus, OrderType } from '@/enums'
import type { Medical } from './room'

// 药品订单-支付药款页面-根据处方信息计算药款
export type OrderPre = {
  id: string
  couponId: string
  pointDeduction: number
  couponDeduction: number
  payment: number
  expressFee: number
  actualPayment: number
  medicines: Medical[]
}
export type Address = {
  id: string
  mobile: string
  receiver: string
  province: string
  city: string
  county: string
  addressDetail: string
}
export type AddressItem = Address & {
  isDefault: 0 | 1
  postalCode: string
}

// 药品订单-查询订单详情信息
export type OrderDetail = {
  id: string
  orderNo: string
  type: 4
  createTime: string
  prescriptionId: string
  status: OrderType
  statusValue: string
  medicines: Medical[]
  countDown: number
  addressInfo: Address
  expressInfo: {
    content: string
    time: string
  }
  payTime: string
  paymentMethod?: 0 | 1
  payment: number
  pointDeduction: number
  couponDeduction: number
  expressFee: number
  actualPayment: number
  roomId: string
}

// 订单-查询物流信息
export type Express = {
  id: string
  content: string
  createTime: string
  status: ExpressStatus
  statusValue: string
}
export type Location = {
  longitude: string
  latitude: string
}
export type Logistics = {
  estimatedTime: string
  name: string
  awbNo: string
  status: ExpressStatus
  statusValue: string
  list: Express[]
  logisticsInfo: Location[]
  currentLocationInfo: Location
}
