<template>
  <div class="sub-sort">
    <div class="sort">
      <a href="javascript:;" :class="{ active: sortParams.sortField === null }" @click="changeSort(null)">
        默认排序</a>

      <a href="javascript:;" :class="{ active: sortParams.sortField === 'publishTime' }"
        @click="changeSort('publishTime')">最新商品</a>

      <a href="javascript:;" :class="{ active: sortParams.sortField === 'orderNum' }"
        @click="changeSort('orderNum')">最高人气</a>

      <a href="javascript:;" :class="{ active: sortParams.sortField === 'evaluateNum' }"
        @click="changeSort('evaluateNum')">评论最多</a>

      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <i class="arrow up" :class="{ active: sortParams.sortField === 'price' && sortParams.sortMethod === 'asc' }" />
        <i class="arrow down"
          :class="{ active: sortParams.sortField === 'price' && sortParams.sortMethod === 'desc' }" />
      </a>
    </div>

    <div class="check">
      <XtxCheckbox v-model="sortParams.inventory" @change="changeChecked">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox v-model="sortParams.onlyDiscount" @change="changeChecked">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'SubSort',
  setup(props, { emit }) {
    // 后台需要的参数
    const sortParams = reactive({
      inventory: false, // 是否有库存 -> 仅显示有货商品
      onlyDiscount: false, // 只显示特惠 -> 仅显示特惠商品
      sortField: null, // publishTime最新商品,orderNum最高人气,price价格排序,evaluateNum评论最多，取值为null代表默认排序
      sortMethod: null // 排序规则，asc为正序，desc为倒序，默认为desc；页面一打开就是默认排序，所以这里也是null
    })
    // 修改排序字段并发请求
    const changeSort = value => {
      if (value === 'price') {
        sortParams.sortField = value
        // 处理价格的排序
        // 特殊情况，默认价格排序，谁也没点，第一次点击时，先给个desc的排序
        if (sortParams.sortMethod === null) sortParams.sortMethod = 'desc'
        // 第一次点击过了，下一次取反就可以了
        else sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
      } else {
        if (sortParams.sortField === value) return // 如果已经选中阻止运行
        sortParams.sortField = value
        sortParams.sortMethod = null // 其它按钮默认都是降序，不需要根据'排序规则'进行判断
      }
      emit('sort-change', sortParams)
    }
    // 修改了复选框发请求
    const changeChecked = () => {
      emit('sort-change', sortParams)
    }

    return { sortParams, changeSort, changeChecked }
  }
}
</script>

<style scoped lang="less">
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .sort {
    display: flex;

    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;

      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }

      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;

        &.up {
          top: 3px;
          border-bottom-color: #bbb;

          &.active {
            border-bottom-color: @xtxColor;
          }
        }

        &.down {
          top: 15px;
          border-top-color: #bbb;

          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }

  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
