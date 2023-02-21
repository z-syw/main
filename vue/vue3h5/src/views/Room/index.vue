<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message :list="list" />
    </van-pull-refresh>
    <room-action
      @send-text="sendText"
      @send-image="sendImage"
      :disabled="consult?.status !== OrderType.ConsultChat"
    />
  </div>
</template>

<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { getConsultOrderDetailAPI } from '@/services/consult'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { nextTick, onMounted, onUnmounted, provide, ref } from 'vue'
import type { Message, TimeMessages } from '@/types/room'
import type { Socket } from 'socket.io-client'
import { MsgType, OrderType } from '@/enums'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { io } from 'socket.io-client'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import dayjs from 'dayjs'

const store = useUserStore()
const route = useRoute()

// 问诊-查询订单详情信息-找医生、极速问诊和开药问诊
const consult = ref<ConsultOrderItem>()
const getConsultOrderDetail = async () => {
  const res = await getConsultOrderDetailAPI(route.query.orderId as string)
  consult.value = res.data
}
onMounted(() => {
  getConsultOrderDetail()
})

const list = ref<Message[]>([]) // arr[0]患者病情 arr[1]温馨提示 arr[2]温馨提示
let socket: Socket
onUnmounted(() => {
  socket.close() // 关闭连接
})
onMounted(() => {
  // 建立连接
  socket = io(baseURL, {
    auth: { token: `Bearer ${store.user?.token}` },
    query: { orderId: route.query.orderId }
  })
  // 连接成功
  socket.on('connect', () => {
    // 再次连接socket时，需要清空数组，避免有重复的数据，是个好习惯
    list.value = []
    console.log('建立连接成功')
  })
  // 连接失败
  socket.on('error', () => {
    console.log('连接失败')
  })
  // 断开链接
  socket.on('disconnect', () => {
    console.log('断开链接')
  })
  // 接收消息
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    const arr: Message[] = []
    data.forEach((item, i) => {
      // 记录消息分组第一组的时间，作为下次获取聊天记录的时间
      if (i === 0) time.value = item.createTime
      arr.push({
        id: item.createTime,
        msgType: MsgType.Notify,
        createTime: item.createTime,
        msg: { content: item.createTime }
      })
      item.items.forEach(item => {
        arr.push({ ...item, notScroll: initialMsg.value === false })
      })
    })
    list.value.unshift(...arr) // 往数组前面追加数据
    loading.value = false // 追加完之后关闭loading效果
    if (!data.length) showToast('没有聊天记录了') // 没有聊天记录给个提示
    // 第一次需要滚动到最底部，上拉刷新不需要滚动到最底部
    nextTick(() => {
      if (initialMsg.value) {
        socket.emit('updateMsgStatus', arr[arr.length - 1].id)
        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      }
    })
  })
  // 订单状态发生变化
  socket.on('statusChange', () => {
    getConsultOrderDetail()
  })
  // 接收文字；接收图片；接收处方消息；医生关闭问诊室会发两条消息{{msg: {content: '关闭问诊室'}}} {{msg: {content: ''}}}
  socket.on('receiveChatMsg', e => {
    list.value.push(e)
    nextTick(() => {
      socket.emit('updateMsgStatus', e.id) // 修改消息为已读
      window.scrollTo(0, document.body.scrollHeight) // 滚动到最底部
    })
  })
})

// 发送文字
const sendText = (text: string) => {
  //向socket服务端发送数据
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}

// 发送图片
const sendImage = (img: Image) => {
  //向socket服务端发送数据
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

// 聊天记录
const loading = ref(false)
const initialMsg = ref(true)
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const onRefresh = () => {
  socket.emit('getChatMsgList', 2, time.value, consult.value?.id) //向socket服务端发送数据
}

// 提交评价
const completeEva = (score: number) => {
  const target = list.value.find(item => item.msgType === MsgType.CardEvaForm)
  if (target) {
    target.msg.evaluateDoc = { score }
    target.msgType = MsgType.CardEva
  }
}
provide('consult', consult)
provide('completeEva', completeEva)
</script>

<style scoped lang="scss">
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);

  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150vh);
  }
}
</style>
