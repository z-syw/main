<template>
  <template v-for="{ createTime, notScroll, msgType, toAvatar, from, msg, id } in list" :key="id">
    <!-- 普通通知arr[0]、arr[2]、医生第一次发消息，会携带一次普通通知。 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.Notify">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 温馨提示arr[3] -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 患者病情arr[1] -->
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ msg.consultRecord?.patientInfo.name }}
          {{ msg.consultRecord?.patientInfo.genderValue }}
          {{ msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ getIllnessTimeText(msg.consultRecord?.illnessTime) }}|
          {{ getConsultFlagText(msg.consultRecord?.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="onPreviewImage(msg.consultRecord?.pictures)">点击查看</van-col>
      </van-row>
    </div>

    <!-- 我发送的文字 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgText && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <van-image :src="store.user?.avatar" />
    </div>
    <!-- 我发送的图片 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgImage && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" @load="load(notScroll)" />
      </div>
      <van-image :src="store.user?.avatar" />
    </div>
    <!-- 医生发送的文字 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgText && store.user?.id !== from">
      <van-image :src="toAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>
    <!-- 医生发送的图片 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgImage && store.user?.id !== from">
      <van-image :src="toAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" @load="load(notScroll)" />
      </div>
    </div>

    <!-- 处方 -->
    <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p @click="showPrescription(msg.prescription?.id)">查看处方<van-icon name="arrow" /></p>
          </div>
          <p>
            {{ msg.prescription?.name }} {{ msg.prescription?.genderValue }} {{ msg.prescription?.age }}岁
            {{ msg.prescription?.diagnosis }}
          </p>
          <p>开方时间：{{ msg.prescription?.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="med in msg.prescription?.medicines" :key="med.id">
            <div class="durg">
              <p>{{ med.name }} {{ med.specs }}</p>
              <p>{{ med.usageDosag }}</p>
            </div>
            <div class="num">x{{ med.quantity }}</div>
          </div>
        </div>
        <div class="foot" @click="buy(msg.prescription)"><span>购买药品</span></div>
      </div>
    </div>

    <!-- 23未提交评价24已提交评价 -->
    <div class="msg msg-comment" v-if="msgType === MsgType.CardEva || msgType === MsgType.CardEvaForm">
      <!-- msgType为24-卡片已提交评论 -->
      <RoomComment :evaluateDoc="msg.evaluateDoc" />
    </div>

    <!-- 医生关闭问诊室 -->
    <div class="msg msg-tip msg-tip-cancel" v-if="msgType === MsgType.NotifyCancel">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { useShowPrescription } from '@/composable'
import { MsgType, PrescriptionStatus } from '@/enums'
import type { Message, Prescription } from '@/types/room'
import { getIllnessTimeText, getConsultFlagText } from '@/utils/filter'
import { showImagePreview, showToast } from 'vant'
import type { Image } from '@/types/consult'
import RoomComment from './RoomComment.vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()

defineProps<{ list: Message[] }>()

// hook - 原始处方
const { showPrescription } = useShowPrescription()

// 格式化日期
const formatTime = (time: string) => dayjs(time).format('HH:mm:ss')
// 预览图片
const onPreviewImage = (pic?: Image[]) => {
  if (pic && pic.length) showImagePreview(pic.map(item => item.url))
}
// 图片加载需要时间，刚开始发送图片会显示在底部，但是不会完全显示，所以需要等图片加载完了之后，在去重新滚到底部
// 但是在聊天记录里，又有一个问题，上拉加载更多时，如果聊天记录里有图片，也会触发这个函数，我的本意是不想在上拉加载时触发
const load = (notScroll?: boolean) => {
  // 判断是聊天记录的图片，就不滚动
  if (notScroll === true) return
  window.scrollTo(0, document.body.scrollHeight)
}

// 购买药品
// 1-未购买，2-已购买，3-已失效
const buy = (pre?: Prescription) => {
  if (pre) {
    if (pre.status === PrescriptionStatus.Invalid) return showToast('处方已失效')
    // 没购买，没订单id，带上处方id，去药品支付页面
    if (pre.status === PrescriptionStatus.NotPayment && !pre.orderId)
      return router.push(`/order/pay?id=${pre.id}`)
    // 已购买，去药品订单详情
    router.push(`/order/${pre.orderId}`)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
