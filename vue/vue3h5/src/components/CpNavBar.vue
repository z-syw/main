<template>
  <van-nav-bar
    fixed
    left-arrow
    :title="title"
    :right-text="rightText"
    @click-left="onClickLeft"
    @click-right="$emit('click-right')"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 动态设置中间的标题和右侧文字
const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void // 点击左侧按钮，支持自定义返回
}>()

// 点击右侧按钮，要做的事情无法确定，让使用组件的地方自己决定
defineEmits<{ (e: 'click-right'): void }>()

// 点击左侧按钮，返回上一页
const onClickLeft = () => {
  if (props.back) return props.back()
  if (history.state?.back) router.back() // 是否有当前网站上个页面的记录，有就返回，没有就跳到首页
  else router.push('/') // 没有记录，跳转首页
}
</script>

<style lang="scss" scoped>
// ::v-deep() {}
:deep() {
  .van-nav-bar {
    // &连接符
    // .van-nav-bar__arrow {}
    // .van-nav-bar__text {}
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }

    &__text {
      font-size: 15px;
    }
  }
}
</style>
