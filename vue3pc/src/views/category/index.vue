<template>
  <div class="top-category">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <!-- 动画执行的条件：元素的创建或移除，这里只是文字发生了变化，所以动画没有执行。动画太多影响执行顺序。 -->
        <transition name="fade-right" mode="out-in">
          <XtxBreadItem :key="topCategory.id">{{ topCategory.name }}</XtxBreadItem>
        </transition>
      </XtxBread>

      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture">
              <p>{{ sub.name }}</p>
            </a>
          </li>
        </ul>
      </div>

      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>{{ sub.name }}</h3>
          <XtxMore />
        </div>
        <div class="body">
          <GoodsItem v-for="goods in sub.goods" :key="goods.id" :goods="goods" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from './components/goods-item.vue'
import { findTopCategory } from '@/api/category'
import { ref, computed, watch } from 'vue'

const store = useStore()
const route = useRoute()

const topCategory = computed(() => {
  // 页面中的数据是根据计算属性计算得来的，假如计算属性没有数据，页面就不会渲染或者会报错
  // 所以在这里先给个空对象，就可以不用在页面中判断数据是否存在了
  let cate = {}
  const item = store.state.category.list.find(item => item.id === route.params.id)
  if (item) { cate = item }
  return cate
})

// 切换的时候，组件没有初始化，所以这里需要监听路由
const subList = ref([])
watch(() => route.params.id, newVal => {
  // 没有id的时候不去发请求；切换路由时，一级切换到二级也监听到了，因为监听的是路由。
  if (newVal && `/category/${newVal}` === route.path) {
    findTopCategory(route.params.id).then(data => {
      subList.value = data.result.children
    })
  }
}, { immediate: true })
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }

  .sub-list {
    margin-top: 20px;
    background-color: #fff;

    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;

      li {
        width: 168px;
        height: 160px;

        a {
          text-align: center;
          display: block;
          font-size: 16px;

          img {
            width: 100px;
            height: 100px;
          }

          p {
            line-height: 40px;
          }

          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }

  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;

    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }

      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }

    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
