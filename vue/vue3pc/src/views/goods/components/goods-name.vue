<template>
  <p class="g-name">{{ goods.name }}</p>
  <p class="g-desc">{{ goods.desc }}</p>
  <p class="g-price">
    <span>{{ goods.price }}</span>
    <span>{{ goods.oldPrice }}</span>
  </p>
  <div class="g-service">
    <xtxCity :fullLocation="fullLocation" @change="change" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import xtxCity from './xtx-city.vue'

const props = defineProps({
  goods: { type: Object, default: () => ({}) }
})

// 提供给后台的数据
const cityCode = ref(null) // 市
const countyCode = ref(null) // 区
const provinceCode = ref(null) // 省
const fullLocation = ref(null) // 完整地址

// 如果用户已经登录了，找到isDefault === 1的对象，这里包含了用户的默认地址
if (props.goods.userAddresses) {
  const defaultAddr = props.goods.userAddresses.find(item => item.isDefault === 1)
  if (defaultAddr) {
    cityCode.value = defaultAddr.cityCode
    countyCode.value = defaultAddr.countyCode
    fullLocation.value = defaultAddr.fullLocation
    provinceCode.value = defaultAddr.provinceCode
  }
}

const change = val => {
  cityCode.value = val.cityCode
  countyCode.value = val.countyCode
  provinceCode.value = val.provinceCode
  fullLocation.value = val.fullLocation
}

</script>

<style lang="less" scoped>
.g-name {
  font-size: 22px
}

.g-desc {
  color: #999;
  margin-top: 10px;
}

.g-price {
  margin-top: 10px;

  span {
    &::before {
      content: "¥";
      font-size: 14px;
    }

    &:first-child {
      color: @priceColor;
      margin-right: 10px;
      font-size: 22px;
    }

    &:last-child {
      color: #999;
      text-decoration: line-through;
      font-size: 16px;
    }
  }
}

.g-service {
  background: #f5f5f5;
  width: 500px;
  margin-top: 5px;

  dl {
    padding-bottom: 20px;
    display: flex;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      color: #666;

      &:last-child {
        span {
          margin-right: 10px;

          &::before {
            content: "•";
            color: @xtxColor;
            margin-right: 2px;
          }
        }

        a {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
