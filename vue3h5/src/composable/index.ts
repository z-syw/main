import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { showImagePreview, showToast, type FormInstance } from 'vant'
import { cancelOrderAPI, deleteOrderAPI, followDoctorAPI, getPrescriptionPicAPI } from '@/services/consult'
import type { ConsultOrderItem, FollowType } from '@/types/consult'
import { getMedicalOrderDetailAPI } from '@/services/order'
import { sendMobileCodeAPI } from '@/services/user'
import type { OrderDetail } from '@/types/order'
import type { CodeType } from '@/types/user'
import { OrderType } from '@/enums'

// 关注
export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  const follow = async (obj: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followDoctorAPI(type, obj.id)
      obj.likeFlag = obj.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}

// 发送验证码
export const useMobileCode = (
  mobile: Ref<string>,
  type: CodeType = 'login',
  form: FormInstance | undefined
) => {
  const time = ref(0) // 倒计时
  let timeId: number // 记录定时器
  const send = async () => {
    if (time.value > 0) return // time的值大于0，已经倒计时，此时不能发验证码
    await form?.validate(mobile.value) // 点击发送验证码对手机号进行校验
    await sendMobileCodeAPI(mobile.value, type)
    time.value = 60
    if (timeId) clearInterval(timeId)
    timeId = window.setInterval(() => {
      time.value--
      if (time.value <= 0) window.clearInterval(timeId)
    }, 1000)
  }
  onUnmounted(() => {
    window.clearInterval(timeId)
  })
  return { time, form, send }
}

// 查看处方
export const useShowPrescription = () => {
  const showPrescription = async (id?: string) => {
    if (id) {
      const res = await getPrescriptionPicAPI(id)
      showImagePreview([res.data.url])
    }
  }
  return { showPrescription }
}

// 取消问诊(订单)
export const useCancelOrder = () => {
  const loadig = ref(false)
  const cancelConsultOrder = async (item: ConsultOrderItem) => {
    loadig.value = true
    try {
      await cancelOrderAPI(item.id)
      item.status = OrderType.ConsultCancel
      item.statusValue = '已取消'
      showToast('取消成功')
    } catch (error) {
      showToast('取消失败')
    } finally {
      loadig.value = false
    }
  }
  return { loadig, cancelConsultOrder }
}

// 删除订单
export const useDeleteOrder = (cb: (id: string) => void) => {
  const loading = ref(false)
  const deleteConsultOrder = async (item: ConsultOrderItem) => {
    loading.value = true
    try {
      await deleteOrderAPI(item.id)
      // cb && cb()
      if (cb) cb(item.id)
      showToast('删除成功')
    } catch (error) {
      showToast('删除失败')
    } finally {
      loading.value = false
    }
  }
  return { loading, deleteConsultOrder }
}

// 药品订单-查询订单详情信息
export const useOrderDetail = (id: string) => {
  const order = ref<OrderDetail>()
  const loading = ref(false)
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetailAPI(id)
      order.value = res.data
    } finally {
      loading.value = false
    }
  })
  return { order, loading }
}
