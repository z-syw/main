<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <cp-nav-bar title="支付" />
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${payInfo.actualPayment}`" class="pay-price" />
    </van-cell-group>

    <div class="pay-space"></div>

    <van-cell-group>
      <van-cell title="患者信息" :value="`${patient?.name} | ${patient?.genderValue} | ${patient?.age}岁`" />
      <van-cell title="病情描述" :label="store.consult.illnessDesc" />
    </van-cell-group>

    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>

    <van-submit-bar
      @click="submit"
      :loading="loading"
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
    />

    <!-- 支付抽屉 -->
    <CpPaySheet
      :order-id="orderId"
      v-model:show="show"
      :on-close="onClose"
      pay-callback="/room"
      :actual-payment="payInfo.actualPayment"
    />
  </div>

  <div class="consult-pay-page" v-else>
    <van-skeleton title :row="4" />
    <van-skeleton title :row="4" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useConsultStore } from '@/stores'
import { getPatientDetailAPI, createConsultOrderAPI, getCounsultOrderPreAPI } from '@/services/consult'
import { showConfirmDialog, showDialog, showToast } from 'vant'
import type { ConsultOrderPreData } from '@/types/consult'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import type { Patient } from '@/types/user'

const store = useConsultStore()
const router = useRouter()

// 问诊-支付页面-计算就诊信息和抵扣信息
const payInfo = ref<ConsultOrderPreData>()
const loadPayInfo = async () => {
  const res = await getCounsultOrderPreAPI({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  payInfo.value = res.data
  store.setCoupon(res.data.couponId) // 优惠卷信息在这个接口里，所以在这里存储优惠卷信息
}
// 问诊-查询患者详情
const patient = ref<Patient>()
const loadPatient = async () => {
  if (store.consult.patientId) {
    const res = await getPatientDetailAPI(store.consult.patientId)
    patient.value = res.data
  }
}
onMounted(() => {
  // 点击立即支付，生成了订单ID，清空了store中的数据，然后在当前页面刷新，会报错
  // 防止在当前页面刷新，问诊记录已经被清空，组件初始化需要校验
  if (!store.consult.type || !store.consult.illnessType || !store.consult.depId || !store.consult.patientId) {
    return showDialog({
      title: '温馨提示',
      message: '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付',
      closeOnPopstate: false // 是否在页面回退时自动关闭
    }).then(() => {
      router.push('/')
    })
  }
  loadPayInfo()
  loadPatient()
})

// 点击支付按钮，调用生成订单接口，生成订单ID
const agree = ref(false) // 用户协议
const loading = ref(false) // 加载中效果
const show = ref(false) // 动作面板
const orderId = ref('') // 订单ID
const submit = async () => {
  if (!agree.value) return showToast('请勾选我已同意支付协议') // 校验用户协议
  loading.value = true // 开启loading效果
  const res = await createConsultOrderAPI(store.consult) // 生成订单接口
  orderId.value = res.data.id // 得到订单ID
  loading.value = false // 关闭loading效果
  store.clear() // 已经生成了订单ID，删除pinia中存储的数据
  show.value = true // 打开动作面板
}

// 生成订单ID后不可关闭抽屉
// 为了引导用户去支付，尽可能不让用户看到退出按钮
// 动作面板提供的属性，关闭前的回调函数，返回false可阻止关闭，支持返回Promise
const onClose = () => {
  return showConfirmDialog({
    title: '温馨提示',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付'
  })
    .then(() => {
      // 用户点击了继续支付，不关闭抽屉
      return false
    })
    .catch(() => {
      // 用户点击了仍要关闭，关闭抽屉，然后让用户跳转到全部订单那里
      orderId.value = ''
      router.push('/user/consult')
      return true
    })
}

// 生成订单后就不让回退了，不管是浏览器的回退按钮，还是自己的回退按钮，都是在操作路由
onBeforeRouteLeave(() => {
  if (orderId.value) return false
})

// 经过上述操作已经得到了订单ID，打开选择支付方式的动作面板，选择'支付方式'，调用获取支付地址接口
// 得到支付地址，跳转到支付宝页面，支付成功，回调到问诊室页面/localhost/room
</script>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}

.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;

  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }

  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }

  .desc {
    flex: 1;

    > span {
      display: block;
      color: var(--cp-tag);

      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}

.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }

    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}

.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}

.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;

  .text {
    color: var(--cp-primary);
  }
}

::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
</style>
