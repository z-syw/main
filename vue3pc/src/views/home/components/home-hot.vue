<template>
  <div class="home-hot">
    <HomePanel title="人气推荐" subTitle="人气爆款 不容错过">
      <transition name="fade" ref="target">
        <ul v-if="result.length" ref="pannel" class="goods-list">
          <li v-for="item in result" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture" />
              <p class="name">{{ item.title }}</p>
              <p class="desc">{{ item.alt }}</p>
            </a>
          </li>
        </ul>
        <HomeSkeleton v-else />
      </Transition>
    </HomePanel>
  </div>
</template>

<script setup>
import { findHot } from '@/api/home'
import { useLazyData } from '@/hooks'
import HomeSkeleton from './home-skeleton.vue'
import HomePanel from './home-panel.vue'

const { result, target } = useLazyData(findHot)
</script>

<style scoped lang='less'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;

  li {
    width: 306px;
    height: 406px;
    .hoverShadow();

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }

    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
