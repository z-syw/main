<template>
  <div class="room-action">
    <van-field
      type="text"
      class="input"
      v-model="text"
      :border="false"
      autocomplete="off"
      placeholder="问医生"
      :disabled="disabled"
      @keyup.enter="sendText"
    />

    <van-uploader :preview-image="false" :disabled="disabled" :after-read="afterRead">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<script setup lang="ts">
import type { Image } from '@/types/consult'
import { uploadImageAPI } from '@/services/consult'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
import { showLoadingToast } from 'vant'
import { ref } from 'vue'

defineProps<{ disabled: boolean }>()

const emit = defineEmits<{
  (e: 'send-text', text: string): void
  (e: 'send-image', img: Image): void
}>()

// 发送文字
const text = ref('')
const sendText = () => {
  if (text.value.trim()) {
    emit('send-text', text.value)
    text.value = ''
  }
}

// 发送图片
// 文件上传完毕后会触发after-read回调函数，获取到对应的file对象
const afterRead: UploaderAfterRead = async item => {
  if (Array.isArray(item)) return
  if (!item.file) return
  const t = showLoadingToast({
    message: '上传中...',
    forbidClick: true
  })
  const res = await uploadImageAPI(item.file)
  t.close()
  emit('send-image', res.data)
}
</script>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;

  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }

  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
