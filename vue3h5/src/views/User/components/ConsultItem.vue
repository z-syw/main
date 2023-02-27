<template>
  <div class="consult-item">
    <div class="head van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p>{{ item.docInfo?.name }}</p>
      <span
        :class="{
          orange: item.status === OrderType.ConsultPay,
          green: item.status === OrderType.ConsultChat
        }"
      >
        {{ item.statusValue }}
      </span>
    </div>
    <div class="body" @click="$router.push(`/user/consult/${item.id}`)">
      <div class="body-row">
        <div class="body-label">病情描述</div>
        <div class="body-value">{{ item.illnessDesc }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">价格</div>
        <div class="body-value">¥ {{ item.payment.toFixed(2) }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">创建时间</div>
        <div class="body-value tip">{{ item.createTime }}</div>
      </div>
    </div>
    <!-- 待支付：取消问诊 + 去支付 -->
    <div class="foot" v-if="item.status === OrderType.ConsultPay">
      <van-button class="gray" plain size="small" round @click="cancelConsultOrder(item)" :loading="loadig">
        取消问诊
      </van-button>
      <van-button type="primary" plain size="small" round :to="`/user/consult/${item.id}`">去支付</van-button>
    </div>

    <!-- 待接诊：取消问诊 + 继续沟通 -->
    <div class="foot" v-if="item.status === OrderType.ConsultWait">
      <van-button class="gray" plain size="small" round @click="cancelConsultOrder(item)" :loading="loadig">
        取消问诊
      </van-button>
      <van-button type="primary" plain size="small" round :to="`/room?orderId=${item.id}`">
        继续沟通
      </van-button>
    </div>

    <!-- 咨询中：查看处方（如果有处方） + 继续沟通 -->
    <div class="foot" v-if="item.status === OrderType.ConsultChat">
      <van-button
        round
        plain
        class="gray"
        size="small"
        v-if="item.prescriptionId"
        @click="showPrescription(item.prescriptionId)"
      >
        查看处方
      </van-button>
      <van-button type="primary" plain size="small" round :to="`/room?orderId=${item.id}`">
        继续沟通
      </van-button>
    </div>

    <!-- 已完成：问诊记录 + 更多 + 未评价?写评价:查看评价 -->
    <div class="foot" v-if="item.status === OrderType.ConsultComplete">
      <!-- 更多 -->
      <CpConsultMore
        :disabled="!item.prescriptionId"
        @on-delete="deleteConsultOrder(item)"
        @on-preview="showPrescription(item.prescriptionId)"
      />
      <van-button class="gray" plain size="small" round :to="`/room?orderId=${item.id}`">问诊记录</van-button>
      <van-button type="primary" plain size="small" round v-if="!item.evaluateId">写评价</van-button>
      <van-button plain size="small" class="gray" round v-else>查看评价</van-button>
    </div>

    <!-- 已取消：删除订单 + 咨询其他医生 -->
    <div class="foot" v-if="item.status === OrderType.ConsultCancel">
      <van-button
        round
        plain
        class="gray"
        size="small"
        :loading="deleteLoading"
        @click="deleteConsultOrder(item)"
      >
        删除订单
      </van-button>
      <van-button type="primary" plain size="small" round to="/">咨询其他医生</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OrderType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consult'
import { useCancelOrder, useDeleteOrder, useShowPrescription } from '@/composable'

defineProps<{ item: ConsultOrderItem }>()
const emit = defineEmits<{ (e: 'on-delete', id: string): void }>()

// hook - 查看处方
const { showPrescription } = useShowPrescription()
// hook - 取消问诊(订单)
const { cancelConsultOrder, loadig } = useCancelOrder()
// hook - 删除订单
const { deleteConsultOrder, loading: deleteLoading } = useDeleteOrder((id: string) => {
  emit('on-delete', id)
})
</script>

<style lang="scss" scoped>
.consult-item {
  border-radius: 4px;
  box-shadow: 0px 0px 22px 0px rgba(245, 245, 245, 0.1);
  background-color: #fff;
  margin-bottom: 10px;

  .head {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;

    .img {
      width: 20px;
      height: 20px;
    }

    > p {
      flex: 1;
      font-size: 15px;
      padding-left: 10px;
    }

    > span {
      color: var(--cp-tag);

      &.orange {
        color: #f2994a;
      }

      &.green {
        color: var(--cp-primary);
      }
    }
  }

  .body {
    padding: 15px 15px 8px 15px;

    .body-row {
      display: flex;
      margin-bottom: 7px;
    }

    .body-label {
      width: 62px;
      font-size: 13px;
      color: var(--cp-tip);
    }

    .body-value {
      width: 250px;

      &.tip {
        color: var(--cp-tip);
      }
    }
  }

  .foot {
    padding: 0 15px 15px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .van-button {
      margin-left: 10px;
      padding: 0 16px;

      &.gray {
        color: var(--cp-text3);
        background-color: var(--cp-bg);
      }
    }

    .more {
      color: var(--cp-tag);
      flex: 1;
      font-size: 13px;
    }
  }
}
</style>
