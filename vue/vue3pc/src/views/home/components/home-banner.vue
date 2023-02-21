<template>
  <div class="home-banner">
    <XtxCarousel :sliders="sliders" autoPlay />
  </div>
</template>

<script setup>
import { findBanner } from '@/api/home'
import { ref } from 'vue'

// 轮播图数据
const sliders = ref([])
findBanner().then(data => { sliders.value = data.result })
</script>

<style lang="less" scoped>
// 覆盖导入的轮播图组件的样式
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
}

.xtx-carousel {
  ::v-deep .carousel-btn.prev {
    left: 270px;
  }

  ::v-deep .carousel-indicator {
    padding-left: 250px;
  }
}
</style>
