<template>
  <div class="cp-radio-btn">
    <a
      @click="$emit('update:modelValue', item.value)"
      :class="{ active: modelValue === item.value }"
      v-for="item in options"
      href="javascript:;"
      :key="item.value"
      class="item"
    >
      {{ item.label }}
    </a>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  // 使用传入数组的方式动态展示需要显示的按钮
  options: { label: string; value: number | string }[]
  // 默认选中：使用此组件时，传入modelValue用来做默认选中，有时候不想做默认选中，所以是可选的
  // 如何做默认选中？使用此组件时，父组件传入了数据，此组件进行了遍历，每个选项都有自己的唯一标识
  // 所以父组件在传入一个默认唯一标识进来，就可以做到默认选中了
  // :class="{ active: modelValue === item.value }"
  modelValue?: number | string
}>()

// 既然默认选中已经做好了，那我如何进行切换呢？
// 是不是只需要更改父组件传递过来的数据就可以做到切换效果了
// 如何更改父组件传递过来的modelValue值？modelValue是父组件传递过来的数据，通过emit来修改
defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;

  .item {
    height: 32px;
    min-width: 60px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid var(--cp-bg);
    background-color: var(--cp-bg);
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;

    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
  }
}
</style>
