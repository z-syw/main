<template>
  <div class="order-pay-page" v-if="address && orderPre">
    <cp-nav-bar title="药品支付" />
    <div class="order-address">
      <p class="area">
        <van-icon name="location" />
        <span>{{ address.province }} {{ address.city }} {{ address.county }}</span>
      </p>
      <p class="detail">{{ address.addressDetail }}</p>
      <p>{{ address.receiver }} {{ address.mobile.replace(/^(\d{3})(?:\d{4})(\d{4})$/, '\$1****\$2') }}</p>
    </div>
    <OrderMedical :medicines="orderPre.medicines" />
    <div class="order-detail">
      <van-cell-group>
        <van-cell title="药品金额" :value="`￥${orderPre.payment}`" />
        <van-cell title="运费" :value="`￥${orderPre.expressFee}`" />
        <van-cell title="优惠券" :value="`-￥${orderPre.couponDeduction}`" />
        <van-cell title="实付款" :value="`￥${orderPre.actualPayment}`" class="price" />
      </van-cell-group>
    </div>
    <div class="order-tip">
      <p class="tip">
        由于药品的特殊性，如非错发、漏发药品的情况，药品一经发出，不得退换，请核对药品信息无误后下单。
      </p>
      <van-checkbox v-model="agree">我已同意<a href="javascript:;">支付协议</a></van-checkbox>
    </div>
    <van-submit-bar
      :price="orderPre.actualPayment * 100"
      button-text="立即支付"
      button-type="primary"
      :loading="loading"
      text-align="left"
      @click="pay"
    />
    <CpPaySheet
      payCallback="/order/pay/result"
      :actual-payment="orderPre.actualPayment"
      :order-id="orderId"
      :show="show"
      @update:show="show = $event"
    />
  </div>

  <div class="order-pay-page" v-else>
    <cp-nav-bar title="药品支付" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getMedicalOrderPreAPI, getAddressListAPI, createMedicalOrderAPI } from '@/services/order'
import type { OrderPre, AddressItem } from '@/types/order'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'

const route = useRoute()

// 获取数据，页面渲染
const orderPre = ref<OrderPre>()
// 药品订单-支付药款页面-根据处方信息计算药款API。根据处方id获取信息。
const getMedicalOrderPre = async () => {
  const res = await getMedicalOrderPreAPI({ prescriptionId: route.query.id as string })
  orderPre.value = res.data
}
const address = ref<AddressItem>()
const getAddressList = async () => {
  const res = await getAddressListAPI()
  // 如果有默认地址，用默认地址，没有用第一次
  if (res.data.length) {
    const def = res.data.find(item => item.isDefault === 1)
    if (def) address.value = def
    else address.value = res.data[0]
  }
}
onMounted(() => {
  getMedicalOrderPre()
  getAddressList()
})

// 立即支付，生成订单id
// 如果处方id不变，再次生成的订单是同一个订单，后台做了设置，不用管
const orderId = ref('')
const loading = ref(false)
const agree = ref(false)
const show = ref(false)
const pay = async () => {
  if (!agree.value) return showToast('请阅读并勾选用户支付协议')
  if (!address.value?.id) return showToast('请选择收获地址')
  loading.value = true
  try {
    // 药品订单-根据处方下药品订单API
    const res = await createMedicalOrderAPI({
      id: orderPre.value?.id as string, // 处方id
      addressId: address.value?.id, // 地址信息
      couponId: orderPre.value?.couponId // 使用优惠券信息，不使用优惠券，不用传值
    })
    orderId.value = res.data.id // 记录订单id
    show.value = true // 打开支付抽屉
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background-color: var(--cp-primary);

  .van-nav-bar__arrow,
  .van-nav-bar__title {
    color: #fff;
  }
}

:deep(.van-cell) {
  .van-cell__title {
    font-size: 16px;
  }

  .van-cell__value {
    font-size: 16px;
  }

  &.price {
    .van-cell__value {
      font-size: 18px;
      color: var(--cp-price);
    }
  }
}

:deep(.van-submit-bar) {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);

  .van-button {
    width: 200px;
  }
}

.order-pay-page {
  padding: 46px 0 65px;
}

.order-address {
  padding: 15px 15px 0 15px;
  background-color: #fff;
  font-size: 13px;

  .area {
    color: var(--cp-tag);
    margin-bottom: 5px;

    .van-icon-location {
      color: #ff7702;
      font-size: 14px;
    }
  }

  .detail {
    font-size: 17px;
    margin-bottom: 5px;
  }

  &::after {
    content: '';
    display: block;
    height: 12px;
    background-color: var(--cp-bg);
    margin: 0 -15px;
    margin-top: 15px;
  }
}

.order-tip {
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;

  .tip {
    font-size: 12px;
    color: var(--cp-tag);
    width: 100%;

    &::before {
      content: '*';
      color: var(--cp-price);
      font-size: 14px;
    }

    margin-bottom: 30px;
  }

  .van-checkbox {
    a {
      color: var(--cp-primary);
    }
  }
}

:deep(.van-submit-bar) {
  .van-button {
    width: 120px;
    height: 30px;
  }

  .van-button__text {
    font-size: 14px;
  }
}
</style>
