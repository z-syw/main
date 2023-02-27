<template>
  <div class='xtx-carousel' @mouseenter="stop" @mouseleave="start">
    <!-- 轮播图容器 -->
    <ul class="carousel-body">
      <li class="carousel-item" v-for="(item, i) in sliders" :key="item.id" :class="{ fade: index === i }">
        <!-- 轮播图片 -->
        <RouterLink to="/" v-if="item.imgUrl">
          <img :src="item.imgUrl" />
        </RouterLink>
        <!-- 轮播商品 -->
        <div v-else class="slider">
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" />
            <p class="name ellipsis">{{ goods.name }}</p>
            <p class="price">&yen;{{ goods.price }}</p>
          </RouterLink>
        </div>
      </li>
    </ul>

    <!-- 上一张 -->
    <a href="javascript:;" @click="toggle(-1)" class="carousel-btn prev">
      <i class="iconfont icon-angle-left" />
    </a>
    <!-- 下一张 -->
    <a href="javascript:;" @click="toggle(1)" class="carousel-btn next">
      <i class="iconfont icon-angle-right" />
    </a>
    <!-- 指示器 -->
    <div class="carousel-indicator">
      <span @click="index = i" v-for="(item, i) in sliders" :key="item.id" :class="{ active: index === i }" />
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'

export default {
  name: 'XtxCarousel',
  props: {
    sliders: { type: Array, default: () => [] }, // 轮播图数据
    autoPlay: { type: Boolean, default: false }, // 是否自动轮播
    duration: { type: Number, default: 3000 } // 自动轮播间隔时长
  },

  setup(props) {
    // 控制轮播的索引，默认显示第一张图片，后续通过控制index进行图片的展示
    const index = ref(0)

    // 自动轮播的逻辑：每隔多久切换一次索引
    let timer = null
    const autoPlayFn = () => {
      // 开启定时器之前，先清除定时器，防止定时器重复添加
      clearInterval(timer)
      timer = setInterval(() => {
        index.value++
        // 滚到最后一张，重新从0开始
        if (index.value >= props.sliders.length) index.value = 0
      }, props.duration)
    }
    // 监听sliders数据变化，判断如果有数据且autoPlay是true，再去调用自动播放
    // props是一个对象，监听对象中某一个属性的变化，需要写成函数返回该值的形式
    // 如果数据是我写死的，可能就监听不到，所以加了立即执行
    // newVal是变化后的数据，变化后有值
    watch(() => props.sliders, newVal => {
      if (newVal.length && props.autoPlay) autoPlayFn()
    }, { immediate: true })

    // 鼠标进入暂停
    const stop = () => { if (timer) clearInterval(timer) }
    // 鼠标离开播放
    const start = () => { if (props.sliders.length && props.autoPlay) autoPlayFn() }

    // 点击左右箭头播放
    const toggle = step => {
      const newIndex = index.value + step // 将要改变的索引
      // 超出的情况，太大了
      if (newIndex > props.sliders.length - 1) {
        index.value = 0
        return
      }
      // 超出的情况，太小了
      if (newIndex < 0) {
        index.value = props.sliders.length - 1
        return
      }
      index.value = newIndex // 正常
    }

    // 定时器一直开着占用内存，组件卸载时，清除定时器
    onUnmounted(() => { clearInterval(timer) })

    return { index, stop, start, toggle }
  }
}
</script>

<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;

  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }

    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      // 轮播图显示时淡入的效果
      transition: opacity 0.5s linear;

      &.fade {
        opacity: 1;
        z-index: 1;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;

      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;

        ~span {
          margin-left: 12px;
        }

        &.active {
          background: #fff;
        }
      }
    }

    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, .2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;

      &.prev {
        left: 20px;
      }

      &.next {
        right: 20px;
      }
    }
  }

  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}

// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;

  >a {
    width: 240px;
    text-align: center;

    img {
      padding: 20px;
      width: 230px !important;
      height: 230px !important;
    }

    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }

    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
