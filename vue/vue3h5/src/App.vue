<template>
  <router-view />
</template>

<script setup lang="ts">
import { mockAPI } from '@/services/mock'
mockAPI().then(res => {
  console.log(res)
})
</script>
