<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a href="javascript:;" :class="{ disabled: index === 0 }" @click="toggle(-1)"
        class="iconfont icon-angle-left prev" />

      <a href="javascript:;" :class="{ disabled: index === 1 }" @click="toggle(1)"
        class="iconfont icon-angle-right next" />
    </template>

    <div class="box" ref="target">
      <Transition name="fade">
        <ul v-if="result.length" class="list" :style="{ transform: `translateX(${-index * 1240}px)` }">
          <li v-for="item in result" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture">
            </a>
          </li>
        </ul>
        <div v-else class="skeleton">
          <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px" />
        </div>
      </Transition>
    </div>
  </HomePanel>
</template>

<script setup>
import { ref } from 'vue'
import { findBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
import HomePanel from './home-panel'

const { result, target } = useLazyData(() => findBrand(10))

// 左右箭头切换的逻辑
const index = ref(0)
const toggle = step => {
  const newIndex = index.value + step
  if (newIndex < 0 || newIndex > 1) return
  index.value = newIndex
}

</script>

<style scoped lang="less">
.skeleton {
  width: 100%;
  display: flex;

  .item {
    margin-right: 10px;

    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}

.home-panel {
  background: #f5f5f5;
}

.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;

  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }

  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;

  .list {
    width: 200%;
    display: flex;
    transition: all 1s;

    li {
      margin-right: 10px;
      width: 240px;

      &:nth-child(5n) {
        margin-right: 0;
      }

      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
