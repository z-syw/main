<template>
  <!-- 用户评价完成之后，再显示这个 -->
  <div class="evalutate-card" v-if="evaluateDoc">
    <p class="title">医生服务评价</p>
    <p class="desc">我们会更加努力提升服务质量</p>
    <van-rate
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
      :modelValue="evaluateDoc.score"
    />
  </div>

  <!-- 医生结束问诊后会先显示这个，让用户进行评价 -->
  <div class="evalutate-card" v-else>
    <p class="title">请您评价</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <van-rate
      size="7vw"
      gutter="3vw"
      v-model="score"
      void-color="rgba(0,0,0,0.04)"
      void-icon="star"
      color="#FADB14"
    />
    <van-field
      rows="3"
      type="textarea"
      maxlength="150"
      show-word-limit
      v-model="content"
      placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
    />
    <div class="footer">
      <van-checkbox v-model="anonymousFlag">匿名评价</van-checkbox>
      <van-button type="primary" size="small" round :class="{ disabled }" @click="submit">
        提交评价
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { showToast } from 'vant'
import { evaluateConsultOrderAPI } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import type { EvaluateDoc } from '@/types/room'
import { inject, computed, ref } from 'vue'

defineProps<{ evaluateDoc?: EvaluateDoc }>()

// 提交评价
const score = ref(0)
const content = ref('')
const anonymousFlag = ref(false)
const completeEva = inject<(score: number) => void>('completeEva')
const consult = inject<Ref<ConsultOrderItem | undefined>>('consult')
const disabled = computed(() => !score.value || !content.value)
const submit = async () => {
  if (!score.value) return showToast('请选择评分')
  if (!content.value) return showToast('请输入评价')
  if (consult?.value?.docInfo?.id) {
    await evaluateConsultOrderAPI({
      score: score.value,
      content: content.value,
      orderId: consult?.value?.id,
      docId: consult?.value?.docInfo?.id,
      anonymousFlag: anonymousFlag.value ? 1 : 0
    })
  }
  if (completeEva) completeEva(score.value)
}
</script>

<style lang="scss" scoped>
.evalutate-card {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 15px;

  .title {
    font-size: 15px;
    margin-bottom: 5px;
  }

  .desc {
    font-size: 12px;
    margin-bottom: 15px;
    color: var(--cp-tip);
  }

  .van-field {
    background-color: var(--cp-bg);
    margin: 15px 0;
    border-radius: 8px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    ::v-deep() {
      .van-checkbox {
        .van-icon {
          font-size: 12px;
        }

        &__label {
          font-size: 12px;
          color: var(--cp-tip);
        }

        height: 16px;
      }

      .van-button {
        padding: 0 16px;

        &.disabled {
          opacity: 1;
          background: #fafafa;
          color: #d9dbde;
          border: #fafafa;
        }
      }
    }
  }
}
</style>
