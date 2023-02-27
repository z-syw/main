<template>
  <div class="xtx-infinite-loading" ref="target">
    <div class="loading" v-if="loading">
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>

    <div class="none" v-if="finished">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export default {
  name: 'XtxInfiniteLoading',
  props: {
    loading: { type: Boolean, default: false },
    finished: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const target = ref(null)
    useIntersectionObserver(target, ([{ isIntersecting }]) => {
      if (isIntersecting) {
        // 触发加载条件：
        // 条件一：如果loading为true表示正在加载，不应该触发加载事件，应该等加载完了再去触发加载事件
        // 条件二：如果我已经把数据加载完了，我又滚动到了最下方，又进入了可视区，还用去触发加载事件吗，不需要了，没有数据了，还加载什么
        if (props.loading === false && props.finished === false) emit('infinite')
      }
    }, { threshold: 0 })

    return { target }
  }
}
</script>

<style scoped lang="less">
.xtx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;

    .img {
      width: 50px;
      height: 50px;
      background: url(../../assets/images/load.gif) no-repeat center / contain;
    }

    .text {
      color: #999;
      font-size: 16px;
    }
  }

  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;

    .img {
      width: 200px;
      height: 134px;
      background: url(../../assets/images/none.png) no-repeat center / contain;
    }

    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>
