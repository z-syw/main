import CpIcon from '@/components/CpNavBar.vue'
import CpNavBar from '@/components/CpNavBar.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
import CpConsultMore from '@/components/CpConsultMore.vue'
import OrderMedical from '@/components/OrderMedical.vue'
import CpPaySheet from '@/components/CpPaySheet.vue'

// 给vue组件添加'全局'组件类型，固定语法（declare module 'vue'）
declare module 'vue' {
  interface GlobalComponents {
    // 指定组件类型，typeof从组件对象得到类型
    CpIcon: typeof CpIcon
    CpRadioBtn: typeof CpRadioBtn
    CpConsultMore: typeof CpConsultMore
    OrderMedical: typeof OrderMedical
    CpPaySheet: typeof CpPaySheet
    CpNavBar: typeof CpNavBar
  }
}
