<template>
  <van-action-sheet
    :show="show"
    @update:show="emit('update:show', $event)"
    :before-close="onClose"
    title="选择支付方式"
    :closeable="false"
  >
    <div class="pay-type">
      <p class="amount">￥{{ actualPayment.toFixed(2) }}</p>
      <van-cell-group>
        <van-cell title="微信支付" @click="paymentMethod = 0">
          <template #icon><cp-icon name="consult-wechat" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
        </van-cell>
        <van-cell title="支付宝支付" @click="paymentMethod = 1">
          <template #icon><cp-icon name="consult-alipay" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <van-button type="primary" round block @click="pay">立即支付</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>

<script setup lang="ts">
import { getConsultOrderPayUrlAPI } from '@/services/consult'
import { showToast } from 'vant'
import { ref } from 'vue'

const props = defineProps<{
  orderId?: string // 订单id
  actualPayment: number // 支付金额
  show: boolean // 控制抽屉是否展开。注意:v-modle:show不可以直接绑定，拆开来写
  onClose?: () => void // 关闭前需要做的事情
  payCallback: string
}>()
const emit = defineEmits<{ (e: 'update:show', show: boolean): void }>()

// 立即支付
// 支付方式（微信/支付宝）
const paymentMethod = ref<0 | 1>()
const pay = async () => {
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  if (props.orderId) {
    // 订单-支付接口API
    const res = await getConsultOrderPayUrlAPI({
      orderId: props.orderId, // 订单id
      payCallback: import.meta.env.VITE_APP_CALLBACK + props.payCallback, // 付款成功后的回调地址
      paymentMethod: paymentMethod.value // 支付方式
    })
    location.href = res.data.payUrl // 跳转到支付页面，去支付
  }
}
</script>

<style scoped lang="scss">
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }

  .btn {
    padding: 15px;
  }

  .van-cell {
    align-items: center;

    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }

    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
