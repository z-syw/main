<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item v-for="item in allDep" :key="item.id" :title="item.name" />
      </van-sidebar>

      <div class="sub-dep">
        <router-link @click="store.setDep(sub.id)" to="/consult/illness" v-for="sub in subDep" :key="sub.id">
          {{ sub.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllDepAPI } from '@/services/consult'
import { computed, onMounted, ref } from 'vue'
import type { TopDep } from '@/types/consult'
import { useConsultStore } from '@/stores'

const store = useConsultStore()

// 通过v-model绑定当前选中项的索引
const active = ref(0)

// 找医生--查询所有科室-层级
const allDep = ref<TopDep[]>([])
onMounted(async () => {
  const res = await getAllDepAPI()
  allDep.value = res.data
})
// 二级科室
const subDep = computed(() => allDep.value[active.value]?.child)
</script>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;

  &-item {
    padding: 14px;
    color: var(--cp-tag);

    &--select {
      color: var(--cp-main);
      font-weight: normal;

      &::before {
        display: none;
      }
    }
  }
}

.consult-dep-page {
  padding-top: 46px;
}

.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;

  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;

    > a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}
</style>
