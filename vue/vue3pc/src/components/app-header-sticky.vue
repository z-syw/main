<template>
  <div class="app-header-sticky" :class="{ show: y >= 78 }">
    <div class="container" v-if="y >= 78">
      <RouterLink class="logo" to="/" />
      <AppHeaderNav />
      <div class="right">
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeaderNav from './app-header-nav'
import { useWindowScroll } from '@vueuse/core'

export default {
  name: 'AppHeaderSticky',
  components: { AppHeaderNav },
  setup() {
    // // 记录y轴卷去的高度
    // const y = ref(0)
    // // 当页面滚动的时候更新它，不一定非要在onMounted中监测，只不过这样会好点，元素渲染完之后去做
    // onMounted(() => {
    //   window.onscroll = () => {
    //     const scrollTop = document.documentElement.scrollTop
    //     y.value = scrollTop
    //   }
    // })

    // VueUse提供的函数，直接是响应式的
    const { y } = useWindowScroll()
    return { y }
  }
}
</script>

<style scoped lang="less">
.app-header-sticky {
  width: 100%; // 充满整个屏幕的宽度
  height: 80px;
  position: fixed; // 脱标
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  transform: translateY(-100%); // 吸顶组件默认在屏幕外面，当屏幕滚动78px时，下来
  opacity: 0;

  // 当检测到屏幕卷去的高度大于等于78px时，用这个类名
  &.show {
    transition: all 0.3s linear; // 过渡效果
    transform: none; // 去掉位移
    opacity: 1; // 设置透明度
  }

  .container {
    display: flex;
    align-items: center;
  }

  .logo {
    width: 200px;
    height: 80px;
    background: url(../assets/images/logo.png) no-repeat right 2px;
    background-size: 160px auto;
  }

  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;

    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;

      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>
