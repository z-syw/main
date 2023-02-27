<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!--
        key唯一标识，避免多个页面使用同一个组件时，出现缓存，没有更新视图。比如：
        Article组件 /article/1 /article/2
        保证只要路径变化了，一定是切换渲染新组件。
       -->
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
