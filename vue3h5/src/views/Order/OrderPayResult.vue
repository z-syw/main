<template>
  <!-- 药品订单状态10待支付11待发货12待收货13已完成14已取消 -->
  <div class="order-pay-result-page" v-if="order?.status !== OrderType.MedicinePay">
    <cp-nav-bar title="药品支付结果" />
    <div class="result">
      <van-icon name="checked" />
      <p class="price">￥ {{ order?.actualPayment }}</p>
      <p class="status">支付成功</p>
      <p class="tip">订单支付成功，已通知药房尽快发出， 请耐心等待~</p>
      <div class="btn">
        <van-button type="primary" :to="`/order/${order?.id}`">查看订单</van-button>
        <van-button :to="`/room?orderId=${order?.roomId}`">返回诊室</van-button>
      </div>
    </div>
  </div>

  <div class="order-pay-result-page" v-if="order?.status === OrderType.MedicinePay">
    <cp-nav-bar title="药品支付结果" />
    <div class="result error">
      <van-icon name="clear" />
      <p class="price">￥ {{ order?.actualPayment }}</p>
      <p class="status">支付失败</p>
      <p class="tip">订单支付失败，可以点击查看订单继续支付，如有疑问联系客服~</p>
      <div class="btn">
        <van-button type="primary" :to="`/order/${order?.id}`">查看订单</van-button>
        <van-button :to="`/room?orderId=${order?.roomId}`">返回诊室</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OrderType } from '@/enums'
import { useRoute } from 'vue-router'
import { useOrderDetail } from '@/composable'

const route = useRoute()

// HOOK - 药品订单-查询订单详情信息。根据订单id查询订单信息。
const { order } = useOrderDetail(route.query.orderId as string)
</script>

<style lang="scss" scoped>
.order-pay-result-page {
  padding-top: 46px;
}

.result {
  display: flex;
  flex-direction: column;
  align-items: center;

  .van-icon {
    font-size: 75px;
    color: var(--cp-primary);
    margin-top: 60px;
  }

  .price {
    font-size: 22px;
    margin-top: 10px;
  }

  .status {
    color: var(--cp-text3);
  }

  .tip {
    color: var(--cp-tip);
    width: 240px;
    text-align: center;
    margin-top: 20px;
  }

  .btn {
    margin-top: 60px;

    .van-button--primary {
      margin-right: 20px;
    }
  }

  &.error {
    .van-icon {
      color: var(--cp-price);
    }
  }
}
</style>
