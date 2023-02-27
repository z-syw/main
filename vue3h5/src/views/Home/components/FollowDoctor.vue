<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;">查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>

    <div class="body">
      <van-swipe :width="(150 / 375) * width" :show-indicators="false" :loop="false">
        <van-swipe-item v-for="item in list" :key="item.id">
          <doctor-card :item="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
import { useWindowSize } from '@vueuse/core'
import { getDoctorPageAPI } from '@/services/consult'
import type { DoctorList } from '@/types/consult'
import { onMounted, ref } from 'vue'

// 150不是在css里设置的，不会被postcss处理，所以需要手动设置
// 根据窗口尺寸，动态得到当前屏幕的宽度
const { width } = useWindowSize()

// 首页-关注的医生列表
const list = ref<DoctorList>([])
const loadData = async () => {
  const res = await getDoctorPageAPI({ current: 1, pageSize: 5 })
  list.value = res.data.rows
}
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;

  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;

    > a {
      color: var(--cp-tip);
    }
  }

  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
