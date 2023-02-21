<template>
  <div>
    <svg-icon
      :icon-class="fullscreen ? 'exit-fullscreen' : 'fullscreen'"
      style="color: #fff; width: 20px; height: 20px"
      @click="changeScreen"
    />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      fullscreen: false
    }
  },
  created() {
    ScreenFull.on('change', () => {
      this.fullscreen = ScreenFull.isFullscreen
    })
  },
  methods: {
    changeScreen() {
      // document.documentElement.requestFullscreen()原生方式，有兼容问题
      ScreenFull.toggle() // 如果是全屏就退出，不是就进入全屏
    }
  }
}
</script>
