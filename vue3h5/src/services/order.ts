import type { OrderPre, AddressItem, OrderDetail, Logistics } from '@/types/order'
import { request } from '@/utils/request'

// 药品订单-支付药款页面-根据处方信息计算药款
export const getMedicalOrderPreAPI = (params: { prescriptionId: string }) =>
  request<OrderPre>('patient/medicine/order/pre', 'GET', params)

// 订单-查询收货地址列表
export const getAddressListAPI = () => request<AddressItem[]>('patient/order/address')

// 药品订单-根据处方下药品订单
export const createMedicalOrderAPI = (data: { id: string; addressId: string; couponId?: string }) =>
  request<{ id: string }>('patient/medicine/order', 'POST', data)

// 药品订单-查询订单详情信息
export const getMedicalOrderDetailAPI = (id: string) =>
  request<OrderDetail>(`patient/medicine/order/detail/${id}`)

// 订单-查询物流信息
export const getMedicalOrderLogisticsAPI = (id: string) =>
  request<Logistics>(`/patient/order/${id}/logistics`)
