<template>
  <ul class="app-header-nav">
    <li class="home">
      <RouterLink to="/">首页</RouterLink>
    </li>

    <li v-for="item in list" :key="item.id" @mouseleave="hide(item)" @mousemove="show(item)">
      <!-- 一级菜单 -->
      <router-link :to="`/category/${item.id}`" @click="hide(item)">{{ item.name }}</router-link>

      <!-- 二级菜单 -->
      <div class="layer" :class="{ open: item.open }">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <router-link :to="`/category/sub/${sub.id}`" @click="hide(item)">
              <img :src="sub.picture" />
              <p>{{ sub.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'AppHeaderNav',
  setup() {
    const store = useStore()

    // vuex中category分类列表数据
    const list = computed(() => store.state.category.list)
    const show = item => {
      store.commit('category/show', item.id)
    }
    const hide = item => {
      store.commit('category/hide', item.id)
    }

    return { list, show, hide }
  }
}
</script>

<style lang="less" scoped>
.app-header-nav {
  width: 820px;
  display: flex;
  padding-left: 40px;
  position: relative;
  z-index: 998;

  >li {
    margin-right: 40px;
    width: 38px;
    text-align: center;

    >a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }

    &:hover {
      >a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
    }
  }
}

// 二级菜单样式
.layer {
  width: 1240px;
  background-color: #fff;
  position: absolute; // 做了定位，脱标
  left: -200px;
  top: 56px;
  height: 0; // 默认为0，因为需要隐藏
  overflow: hidden;
  opacity: 0; // 默认为0，因为需要隐藏
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;

  // 显示二级菜单
  // 这个类名没有放在hover下
  &.open {
    height: 132px;
    opacity: 1;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;

    li {
      width: 110px;
      text-align: center;

      img {
        width: 60px;
        height: 60px;
      }

      p {
        padding-top: 10px;
      }

      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
