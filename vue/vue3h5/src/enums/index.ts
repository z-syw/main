// 问诊-保存/修改问诊订单
export enum ConsultType {
  Doctor = 1,
  Fast = 2,
  Medication = 3
}
export enum IllnessTime {
  Week = 1,
  Month = 2,
  HalfYear = 3,
  More = 4
}

// 聊天-接收对话信息
export enum MsgType {
  MsgText = 1,
  MsgImage = 4,
  CardPat = 21,
  CardPre = 22,
  CardEvaForm = 23,
  CardEva = 24,
  Notify = 31,
  NotifyTip = 32,
  NotifyCancel = 33
}
// 处方状态
export enum PrescriptionStatus {
  NotPayment = 1,
  Payment = 2,
  Invalid = 3
}

// 问诊-查询订单详情信息-找医生、极速问诊和开药问诊
export enum OrderType {
  ConsultPay = 1,
  ConsultWait = 2,
  ConsultChat = 3,
  ConsultComplete = 4,
  ConsultCancel = 5,
  MedicinePay = 10,
  MedicineSend = 11,
  MedicineTake = 12,
  MedicineComplete = 13,
  MedicineCancel = 14
}

// 订单-查询物流信息
export enum ExpressStatus {
  Delivered = 1,
  Received = 2,
  Transit = 3,
  Delivery = 4,
  Signed = 5
}
