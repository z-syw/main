import type {
  Image,
  TopDep,
  FollowType,
  KnowledgePage,
  KnowledgeParams,
  ConsultOrderListParams,
  CounsultOrderPreParams,
  ConsultOrderPreData,
  ConsultOrderPage,
  ConsultOrderItem,
  PartialConsult,
  DoctorPage,
  PageParams
} from '@/types/consult'
import { request } from '@/utils/request'
import type { Patient } from '@/types/user'

// 首页-查询推荐/减脂/饮食健康/关注页面--百科文章列表
export const getKnowledgePageAPI = (params: KnowledgeParams) =>
  request<KnowledgePage>('patient/home/knowledge', 'GET', params)

// 首页-关注的医生列表
export const getDoctorPageAPI = (params: PageParams) => request<DoctorPage>('home/page/doc', 'GET', params)

// 关注-关注操作
export const followDoctorAPI = (type: FollowType = 'doc', id: string) => request('like', 'POST', { type, id })

// 找医生--查询所有科室-层级
export const getAllDepAPI = () => request<TopDep[]>('dep/all', 'GET')

/**
 * 上传文件/图片
 * FormData是浏览器提供的webAPI，它以键值对的方式存储数据，FormData是一个构造函数
 * const fd = new FormData() 创建一个空白的FormData对象，里面没有包含任何数据
 * 调用FormData对象的append(键, 值)方法，可以向空白的FormData中追加键值对数据
 * 键: 数据项的名字，必须是字符串。值: 可以是任意类型(字符串、数字、文件类型等)
 */
export const uploadImageAPI = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('upload', 'POST', fd)
}

// 问诊-支付页面-计算就诊信息和抵扣信息
export const getCounsultOrderPreAPI = (params: CounsultOrderPreParams) =>
  request<ConsultOrderPreData>('patient/consult/order/pre', 'GET', params)

// 问诊-查询患者详情
export const getPatientDetailAPI = (id: string) => request<Patient>(`patient/info/${id}`, 'GET')

// 问诊-保存/修改问诊订单
export const createConsultOrderAPI = (data: PartialConsult) =>
  request<{ id: string }>('patient/consult/order', 'POST', data)

// 订单-支付接口
type ReqPay = {
  orderId: string
  paymentMethod: 0 | 1
  payCallback: string
}
export const getConsultOrderPayUrlAPI = (data: ReqPay) =>
  request<{ payUrl: string }>('patient/consult/pay', 'POST', data)

// 问诊-查询订单详情信息-找医生、极速问诊和开药问诊
export const getConsultOrderDetailAPI = (orderId: string) =>
  request<ConsultOrderItem>('/patient/consult/order/detail', 'GET', { orderId })

// 药品订单-根据处方ID查询处方单
export const getPrescriptionPicAPI = (id: string) =>
  request<{ url: string }>(`patient/consult/prescription/${id}`, 'GET')

// 问诊-订单-评价医生
export const evaluateConsultOrderAPI = (data: {
  score: number
  docId: string
  orderId: string
  content: string
  anonymousFlag: 0 | 1
}) => request<{ id: string }>('patient/order/evaluate', 'POST', data)

// 问诊记录-订单列表-找医生、极速问诊、开药问诊
export const getConsultOrderListAPI = (params: ConsultOrderListParams) =>
  request<ConsultOrderPage>('patient/consult/order/list', 'GET', params)

// 订单-取消订单
export const cancelOrderAPI = (id: string) => request(`patient/order/cancel/${id}`, 'PUT')

// 订单-删除订单
export const deleteOrderAPI = (id: string) => request(`patient/order/${id}`, 'DELETE')
