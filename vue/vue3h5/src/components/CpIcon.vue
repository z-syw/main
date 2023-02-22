<template>
  <!-- svg精灵图原理：利用svg的symbol，将每个svg包裹在symbol中，通过use使用该symbol -->
  <svg aria-hidden="true" class="cp-icon">
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
// 精灵图可以减少请求次数
// 把多张图片合到一张图片，第一次请求，图片被缓存到浏览器上，再次请求就不会发请求了，性能会更好
// svg形成精灵图，在页面发现需要到它的时候，就会下载精灵图，那么此后又遇到了要访问这个精灵图将不再下载，直接读取缓存的资源

// 提供一个props属性，确定使用哪个图标，使用的规则：文件夹名称-图片名称
defineProps<{ name: string }>()
</script>

<style lang="scss" scoped>
.cp-icon {
  // 之前用的字体图标，可以通过font-size控制大小
  // 这里是图片不可以使用font-size，但是我还是想通过font-size控制，可以用em设置
  width: 1em;
  height: 1em;
}
</style>
