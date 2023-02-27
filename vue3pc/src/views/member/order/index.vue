<template>
  <div class="member-order">
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel :label="item.label" :name="item.name" v-for="item in orderStatus" :key="item.name">{{ item.label }}
      </XtxTabsPanel>
    </XtxTabs>
  </div>
</template>

<script>
import { ref } from 'vue'
import { orderStatus } from '@/api/constances'
export default {
  name: 'MemberOrder',
  setup() {
    // 默认激活
    const activeName = ref('all')

    const tabClick = val => { console.log(val) }

    return { activeName, tabClick, orderStatus }
  }
}
</script>

<style scoped lang="less">
.member-order {
  height: 100%;
  background-color: #fff;
}
</style>
