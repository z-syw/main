<template>
  <div v-show="name === activeName">
    <slot />
  </div>
</template>

<script>
import { inject } from 'vue'
export default {
  name: 'XtxTabsPanel',
  props: {
    // 选项卡导航菜单
    label: { type: String, default: '' },
    // 选项卡唯一标识
    name: { type: [String, Number], default: '' }
  },
  setup() {
    const activeName = inject('activeName')
    return { activeName }
  }
}
</script>
