<template>
  <!-- 概览 -->
  <HomeOverview />

  <!-- 收藏 -->
  <HomePanel title="我的收藏">
    <GoodsItem v-for="item in goods" :key="item.id" :goods="item" />
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import { findCollect } from '@/api/member'
import HomePanel from './components/home-panel.vue'
import HomeOverview from './components/home-overview.vue'
import GoodsItem from '@/views/category/components/goods-item.vue'
export default {
  name: 'MemberHome',
  components: { HomeOverview, HomePanel, GoodsItem },
  setup() {
    // 会员中心-收藏（商品、专题、品牌）：获取收藏
    const goods = ref([])
    findCollect({ page: 1, pageSize: 4 }).then(data => {
      goods.value = data.result.data
    })
    return { goods }
  }
}
</script>
