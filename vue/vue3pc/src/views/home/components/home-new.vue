<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
      <template #right>
        <XtxMore path="/" />
      </template>

      <transition name="fade" ref="target">
        <ul class="goods-list" v-if="result.length">
          <li v-for="item in result" :key="item.id">
            <a href="javascipt:;">
              <img :src="item.picture" />
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="price">&yen;{{ item.price }}</p>
            </a>
          </li>
        </ul>
        <HomeSkeleton v-else bg="#f0f9f4" />
      </transition>
    </HomePanel>
  </div>
</template>

<script setup>
import { findNew } from '@/api/home'
import { useLazyData } from '@/hooks'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'

const { result, target } = useLazyData(findNew)

// 新鲜好物数据
// const goods = ref([])
// const findNewList = () => {
//   findNew().then(res => {
//     goods.value = res.result
//   })
// }
// onMounted(() => {
//   findNewList()
// })
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;

  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }

    .price {
      color: @priceColor;
    }
  }
}
</style>
