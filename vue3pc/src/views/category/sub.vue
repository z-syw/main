<template>
  <div class='sub-category'>
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filter-change="filterChange" />
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sort-change="sortChange" />
        <!-- 商品列表 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 无限循环 -->
        <XtxInfiniteLoading @infinite="infinite" :loading="loading" :finished="finished" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryGoods } from '@/api/category'
import GoodsItem from './components/goods-item.vue'
import SubFilter from './components/sub-filter.vue'
import SubBread from './components/sub-bread.vue'
import SubSort from './components/sub-sort.vue'

const route = useRoute()

// 商品分类：商品列表_临时
const loading = ref(false)
const finished = ref(false)
const goodsList = ref([])
let reqParams = { page: 1, pageSize: 20, categoryId: route.params.id }
const infinite = () => {
  loading.value = true
  findSubCategoryGoods(reqParams).then(({ result }) => {
    if (result.items.length) {
      // 有数据，就追加数据
      goodsList.value.push(...result.items)
      reqParams.page++
    } else finished.value = true // 没有数据，代表加载完成
    loading.value = false
  })
}

// 更改了二级分类之后，重新加载数据
watch(() => route.params.id, newVal => {
  if (newVal && `/category/sub/${newVal}` === route.path) {
    goodsList.value = []
    reqParams = { page: 1, pageSize: 20, categoryId: route.params.id }
  }
})

// 修改了排序方式和复选框，重新请求
const sortChange = sortParams => {
  reqParams = { ...reqParams, ...sortParams }
  reqParams.page = 1
  goodsList.value = []
  infinite()
}

// 更改品牌和其它的筛选条件，重新请求
const filterChange = sortParams => {
  reqParams = { ...reqParams, ...sortParams }
  reqParams.page = 1
  goodsList.value = []
}
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;

    li {
      margin-right: 20px;
      margin-bottom: 20px;

      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
