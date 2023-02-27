<template>
  <div class="xtx-checkbox" @click="changeModelValue">
    <i class="iconfont icon-checked" v-if="modelValue" />
    <i class="iconfont icon-unchecked" v-else />
    <span v-if="$slots.default">
      <slot />
    </span>
  </div>
</template>

<script>
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const changeModelValue = () => {
      emit('update:modelValue', !props.modelValue)
      emit('change', !props.modelValue)
    }

    return { changeModelValue }
  }
}
</script>

<!--
  <template>
  <div class="xtx-checkbox" @click="changeChecked">
    <i class="iconfont icon-checked" v-if="checked" />
    <i class="iconfont icon-unchecked" v-else />
    <span v-if="$slots.default">
      <slot />
    </span>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'

export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    // 使用useVModel实现双向数据绑定
    const checked = useVModel(props, 'modelValue', emit) // 此时checked是一个ref类型的响应式数据
    const changeChecked = () => {
      // 通知父组件
      checked.value = !checked.value // emit('update:modelValue', !checked.value)
      emit('change', !checked.value) // 让组件支持change事件，目前没啥用，用到的时候在解释
    }

    return { checked, changeChecked }
  }
}
</script>
-->

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;

  .icon-checked {
    color: @xtxColor;

    ~span {
      color: @xtxColor;
    }
  }

  i {
    position: relative;
    top: 1px;
  }

  span {
    margin-left: 2px;
  }
}
</style>
