<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg"
        :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText"
        :collapse-transition="false" mode="vertical"
      >
        <!-- 侧边栏 -->
        <SidebarItem v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './Logo'
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
export default {
  name: 'Sidebar',
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar', 'routes']),

    // this.$router.options.routes只能拿到new VueRouter时配置项里routes数组
    // 后续addRoutes添加的路由规则对象，并咩有影响到这里
    // 解决方案：把路由规则数组，存放在vuex中，只要改变用到的地方就会更新
    routes() {
      // this.$router.options.routes 可以拿到初始化时配置的路由规格
      // return this.$router.options.routes
      return this.$store.state.permission.routes
    },

    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },

    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },

    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
