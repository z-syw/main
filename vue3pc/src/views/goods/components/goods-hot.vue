<template>
  <div class="goods-hot">
    <h3>
      <slot />
    </h3>
    <div v-if="goodsList">
      <GoodsItem v-for="item in goodsList" :key="item.id" :goods="item" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { findHotGoods } from '@/api/product'
import GoodsItem from '@/views/category/components/goods-item.vue'
import { ref } from 'vue'

const route = useRoute()

const props = defineProps({
  type: { type: Number, default: 1 }
})

const goodsList = ref()
findHotGoods({ id: route.params.id, limit: 2, type: props.type }).then(data => {
  goodsList.value = data.result
})
</script>

<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }

  :v-deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;

    img {
      width: 200px;
      height: 200px;
    }

    p {
      margin: 0 10px;
    }

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
