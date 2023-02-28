<template>
  <div class="xtx-pagination">
    <a v-if="myCurrentPage > 1" href="javascript:;" @click="changePage(myCurrentPage - 1)">上一页</a>
    <a v-else href="javascript:;" class="disabled">上一页</a>

    <span v-if="pager.start > 1">...</span>

    <a @click="changePage(i)" href="javascript:;" :class="{ active: i === myCurrentPage }" v-for="i in pager.btnArr"
      :key="i">{{ i }}</a>

    <span v-if="pager.end < pageCount">...</span>

    <a v-if="myCurrentPage < pageCount" href="javascript:;" @click="changePage(myCurrentPage + 1)">下一页</a>
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  total: { type: Number, default: 100 },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 }
})

const emit = defineEmits(['current-change'])

const count = ref(5) // 按钮个数
const myTotal = ref(100) // 总条数
const myPageSize = ref(10) // 每页条数
const pageCount = Math.ceil(myTotal.value / myPageSize.value) // 总页数
const myCurrentPage = ref(1) // 当前显示的页码（第几页），默认第一页
// 根据按钮个数和当前第几页算出起始页码和结束页码
const pager = computed(() => {
  // 理想情况下
  let start = myCurrentPage.value - Math.floor(count.value / 2)
  let end = start + count.value - 1
  // 如果起始页码小于1，需要重新计算
  if (start < 1) {
    start = 1
    end = (start + count.value - 1) > pageCount ? pageCount : (start + count.value - 1)
  }
  // 如果结束页码大于总页数，需要重新计算
  if (end > pageCount) {
    end = pageCount
    start = (end - count.value + 1) < 1 ? 1 : (end - count.value + 1)
  }
  // 根据起始页码和结束页码算出按钮数组
  const btnArr = []
  for (let i = start; i <= end; i++) btnArr.push(i)

  return { btnArr, start, end }
})

// 监听传人的值改变
watch(props, () => {
  myTotal.value = props.total
  myPageSize.value = props.pageSize
  myCurrentPage.value = props.currentPage
}, { immediate: true })

// 改变页码
const changePage = newPage => {
  myCurrentPage.value = newPage
  emit('current-change', newPage)
}
</script>

<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;

  >a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;

    &:hover {
      color: @xtxColor;
    }

    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;

      &:hover {
        color: #333
      }
    }
  }

  >span {
    margin-right: 10px;
  }
}
</style>
