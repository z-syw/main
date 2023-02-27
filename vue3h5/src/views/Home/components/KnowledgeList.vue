<template>
  <div class="knowledge-list">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <KnowledgeCard v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getKnowledgePageAPI } from '@/services/consult'
import type { KnowledgeList, KnowledgeParams, KnowledgeType } from '@/types/consult'
import KnowledgeCard from './KnowledgeCard.vue'

// type传递给后台的数据
const props = defineProps<{ type: KnowledgeType }>()
// 传递给后台的数据
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1, // 当前页
  pageSize: 5 // 每页多少条
})
const list = ref<KnowledgeList>([]) // 接收后台的数据
const loading = ref(false)
const finished = ref(false)
// 当组件滚动到底部时，会触发load事件并将loading设置成true，此时可以发起异步操作并更新数据
const onLoad = async () => {
  const res = await getKnowledgePageAPI(params.value)
  list.value.push(...res.data.rows)
  // 若数据已全部加载完毕，则直接将finished设置成true
  if (params.value.current >= res.data.pageTotal) finished.value = true
  else params.value.current++
  loading.value = false // 数据更新完毕后，将loading设置成false
}
</script>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
