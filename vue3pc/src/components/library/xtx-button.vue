<template>
  <!-- calss的数组语法，可以同时支持多个动态calss的绑定 -->
  <button class="xtx-button ellipsis" :class="[size, type]">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'XtxButton',
  props: {
    // 按钮尺寸
    size: {
      type: String,
      default: 'middle',
      // val代表传过来的值
      // 对传入过来的参数做校验，如果满足条件就返回true，不满足就返回false
      // 如果传入的参数不在可选参数的列表中，给出用户提示，告诉他哪个参数传错了
      validator: function (val) {
        const sizeList = ['middle', 'large', 'small', 'mini']
        return sizeList.includes(val)
      }
    },
    // 按钮颜色
    type: { type: String, default: 'default' }
  },
  computed: {
    // 也可以通过计算属性，动态得出类名
    typeClass() {
      return `${this.type}`
    }
  }
}
</script>

<style scoped lang="less">
.xtx-button {
  appearance: none;
  border: none;
  outline: none;
  background: #fff;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}

// 大
.large {
  width: 240px;
  height: 50px;
  font-size: 16px;
}

// 中
.middle {
  width: 180px;
  height: 50px;
  font-size: 16px;
}

// 小
.small {
  width: 100px;
  height: 32px;
  font-size: 14px;
}

// 超小
.mini {
  width: 60px;
  height: 32px;
  font-size: 14px;
}

// 默认颜色
.default {
  border-color: #e4e4e4;
  color: #666;
}

// 主要颜色
.primary {
  border-color: @xtxColor;
  background: @xtxColor;
  color: #fff;
}

// 次要颜色
.plain {
  border-color: @xtxColor;
  color: @xtxColor;
  background: lighten(@xtxColor, 50%);
}

// 灰色颜色
.gray {
  border-color: #ccc;
  background: #ccc;
  color: #fff;
}
</style>
