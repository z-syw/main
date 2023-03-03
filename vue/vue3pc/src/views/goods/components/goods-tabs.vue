<template>
  <div class="goods-tabs">
    <nav>
      <a :class="{ active: activeName === 'goodsDetail' }" @click="activeName = 'goodsDetail'" href="javascript:;">
        商品详情
      </a>

      <a :class="{ active: activeName === 'goodsComment' }" @click="activeName = 'goodsComment'" href="javascript:;">
        商品评价<span>({{ goods.commentCount }})</span>
      </a>
    </nav>

    <KeepAlive>
      <component :is="activeName === 'goodsDetail' ? goodsDetail : goodsComment" />
    </KeepAlive>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import goodsComment from './goods-comment.vue'
import goodsDetail from './goods-detail.vue'

const activeName = ref('goodsDetail')
const goods = inject('goods')

</script>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;

      >span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }

      &:first-child {
        border-right: 1px solid #f5f5f5;
      }

      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
