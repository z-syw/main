<template>
  <div class="cp-consult-more">
    <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect" placement="top-start">
      <template #reference>更多</template>
    </van-popover>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{
  (e: 'on-delete'): void
  (e: 'on-preview'): void
}>()

const showPopover = ref(false)
const actions = computed(() => [{ text: '查看处方', disabled: props.disabled }, { text: '删除订单' }])
const onSelect = (action: { text: string }, i: number) => {
  if (i === 1) emit('on-delete')
  if (i === 0) emit('on-preview')
}
</script>

<style scoped lang="scss">
.cp-consult-more {
  color: var(--cp-tag);
  flex: 1;
  font-size: 13px;
}
</style>
