<template>
  <div class="xtx-bread-item">
    <router-link v-if="to" :to="to">
      <slot />
    </router-link>

    <span v-else>
      <slot />
    </span>
  </div>
</template>

<script>
export default {
  name: 'XtxBreadItem',
  props: {
    to: { type: [String, Object], default: '' }
  }
}
</script>

<style scoped>
/* 先找到父元素，再找到所有的子元素，找到最后一个，判断是不是li，是就选中，不是就是无效选择器 */
/* ul li:last-child {} */

/* 先找到父元素，再找到所有的类型为li的元素，选中最后一个 */
/* ul li:last-of-type {} */
</style>
