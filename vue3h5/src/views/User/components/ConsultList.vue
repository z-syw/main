<template>
  <div class="consult-list">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <consult-item v-for="item in list" :key="item.id" :item="item" @on-delete="onDelete" />
    </van-list>
  </div>
</template>

<script setup lang="ts">
import type { ConsultType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consult'
import { getConsultOrderListAPI } from '@/services/consult'
import ConsultItem from './ConsultItem.vue'
import { reactive, ref } from 'vue'

const props = defineProps<{ type: ConsultType }>()

// 获取列表数据
const list = ref<ConsultOrderItem[]>([])
const loading = ref(false)
const finished = ref(false)
const params = reactive({
  current: 1,
  pageSize: 5,
  type: props.type
})
const onLoad = async () => {
  const res = await getConsultOrderListAPI(params)
  list.value.push(...res.data.rows)
  if (params.current < res.data.pageTotal) params.current++
  else finished.value = true
  loading.value = false
}

// 删除订单
const onDelete = (id: string) => {
  list.value = list.value.filter(item => item.id !== id)
}
</script>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
