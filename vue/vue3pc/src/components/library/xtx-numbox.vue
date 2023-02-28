<template>
  <div class="xtx-numbox">
    <div class="label">{{ label }}</div>
    <div class="numbox">
      <a href="javascript:;" @click="changeNum(-1)">-</a>
      <!-- 这里不可以使用v-model，props中的数据只读不能赋值 -->
      <input type="text" readonly :value="modelValue">
      <a href="javascript:;" @click="changeNum(1)">+</a>
    </div>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'

export default {
  name: 'XtxNumbox',
  props: {
    label: { type: String },
    modelValue: { type: Number, default: 1 },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 100 }
  },
  setup(props, { emit }) {
    const num = useVModel(props, 'modelValue', emit)
    const changeNum = step => {
      const newNum = num.value + step
      if (newNum < props.min) return
      if (newNum > props.max) return
      num.value = newNum
      emit('change', newNum)
    }

    return { changeNum }
  }
}
</script>

<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;

  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }

  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;

    >a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;

      &:first-of-type {
        border-right: 1px solid #e4e4e4;
      }

      &:last-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }

    >input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
