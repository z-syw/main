<template>
  <div class="goods-image">
    <!-- 大图默认隐藏，鼠标进入中图时在显示 -->
    <div class="large" v-show="show" :style="[{ backgroundImage: `url(${images[currIndex]})` }, largePosition]" />
    <div class="middle" ref="target">
      <!-- 中图 -->
      <img :src="images[currIndex]">
      <!-- 遮罩默认隐藏，鼠标进入中图时在显示 -->
      <div v-show="show" class="layer" :style="layerPosition" />
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li v-for="(img, i) in images" :key="img" :class="{ active: i === currIndex }">
        <!-- 鼠标经过的时候，记录当前图片的索引，才能动态的取出对应的图片 -->
        <img @mouseenter="currIndex=i" :src="img">
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useMouseInElement } from '@vueuse/core'
import { reactive, ref, watch } from 'vue'

defineProps({
  images: { type: Array, default: () => [] }
})

// 图片索引
const currIndex = ref(0)
// 是否显示遮罩和大图，默认不显示
const show = ref(false)
// 遮罩的坐标（.layer）
const layerPosition = reactive({
  left: 0,
  top: 0
})
// 大图背景定位
const largePosition = reactive({
  backgroundPositionX: 0,
  backgroundPositionY: 0
})

const target = ref(null)
// 使用vueuse方法得到元素左上角坐标和是否进入元素
const { elementX, elementY, isOutside } = useMouseInElement(target)

watch([elementX, elementY, isOutside], () => {
  show.value = !isOutside.value
  // 临时记录坐标
  const position = { x: 0, y: 0 }
  // x
  if (elementX.value < 100) position.x = 0
  else if (elementX.value > 300) position.x = 200
  else position.x = elementX.value - 100
  // y
  if (elementY.value < 100) position.y = 0
  else if (elementY.value > 300) position.y = 200
  else position.y = elementY.value - 100

  // 遮罩坐标
  layerPosition.left = position.x + 'px'
  layerPosition.top = position.y + 'px'

  // 大图坐标
  largePosition.backgroundPositionX = -2 * position.x + 'px'
  largePosition.backgroundPositionY = -2 * position.y + 'px'
})
</script>

<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;

  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }

  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;

    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, .2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }

  .small {
    width: 80px;

    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;

      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
