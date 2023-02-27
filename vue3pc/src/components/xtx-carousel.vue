<template>
  <div class="banner">
    <ul>
      <li class="carousel-item" v-for="(item, i) in sliders" :key="item.id" :class="{ fade: index === i }">
        <a href="javascript:;">
          <img :src="item.imgUrl">
        </a>
      </li>
    </ul>

    <div class="prev-next">
      <div class="prev" @click="toggle(-1)">
        <i class="iconfont icon-angle-left" />
      </div>
      <div class="next" @click="toggle(1)">
        <i class="iconfont icon-angle-right" />
      </div>
    </div>

    <ul class="slider_indicators">
      <li v-for="i in 5" :key="i"></li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { findBanner } from '@/api/home'

// 轮播图数据
const sliders = ref([])
findBanner().then(data => { sliders.value = data.result })
// 轮播逻辑
const index = ref(0)
const toggle = step => {
  const newIndex = index.value + step
  if (newIndex > sliders.value.length - 1) {
    index.value = 0
    return
  }
  if (newIndex < 0) {
    index.value = sliders.value.length - 1
    return
  }
  index.value = newIndex
}
</script>

<style lang="less" scoped>
.banner {
  position: relative;
  width: 800px;
  height: 400px;
  margin: 0 auto;

  .carousel-item {
    position: absolute;

    img {
      width: 800px;
      height: 400px;
    }
  }

  .prev,
  .next {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    z-index: 1;
    width: 25px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
    background-color: pink;
  }

  .next {
    right: 0;
  }

  .slider_indicators {
    position: absolute;
    left: 30px;
    z-index: 1;

    li {
      float: left;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 5px;
      background-color: skyblue;
    }
  }
}

.fade {
  z-index: 1;
}
</style>
