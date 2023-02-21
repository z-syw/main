<template>
  <XtxBread>
    <XtxBreadItem :to="'/'">首页</XtxBreadItem>
    <XtxBreadItem :to="`/category/${category.item.id}`" v-if="category.item">
      {{ category.item.name }}
    </XtxBreadItem>
    <transition name="fade-right" mode="out-in">
      <XtxBreadItem :key="category.sub.id" v-if="category.sub">{{ category.sub.name }}</XtxBreadItem>
    </transition>
  </XtxBread>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'

const route = useRoute()
const store = useStore()

// 通过计算属性得到一级类目id、名称和二级类目id、名称
const category = computed(() => {
  const cate = {}
  store.state.category.list.forEach(item => {
    if (item.children) {
      item.children.forEach(sub => {
        if (sub.id === route.params.id) {
          cate.item = { id: item.id, name: item.name } // 一级类目
          cate.sub = { id: sub.id, name: sub.name } // 二级类目
        }
      })
    }
  })
  return cate
})
</script>
