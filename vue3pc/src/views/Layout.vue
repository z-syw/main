<template>
  <!-- 通栏组件 -->
  <AppNavBar />
  <!-- 头部组件 -->
  <AppHeader />
  <!-- 吸顶组件，每个页面都可以看到，所以放在这里 -->
  <AppHeaderSticky />

  <!-- 二级路由 -->
  <div class="main">
    <RouterView />
  </div>

  <!-- 底部组件 -->
  <AppFooter />
</template>

<script>
import { useStore } from 'vuex'
import AppNavBar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'

export default {
  name: 'LayoutPage',
  components: { AppNavBar, AppHeader, AppFooter, AppHeaderSticky },
  setup() {
    // 很多地方都用到了这个数据，所以在这里调用
    // 首页模块：首页-全部分类（包含推荐商品）
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scoped lang="less">
.main {
  min-height: 600px;
}
</style>
