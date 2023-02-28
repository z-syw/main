<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img v-if="val.picture" :src="val.picture" :title="val.name"
            :class="{ selected: val.selected, disabled: val.disabled }" @click="changeSku(item, val)">
          <span v-else :class="{ selected: val.selected, disabled: val.disabled }" @click="changeSku(item, val)">
            {{ val.name }}
          </span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script setup>
import bwPowerSet from '@/vender/power-set'

const props = defineProps({
  goods: { type: Object, default: () => ({}) },
  skuId: { type: String, default: '' }
})

const emit = defineEmits(['changeSku'])

// 默认选中
const initDefaultSelected = (goods, skuId) => {
  const sku = goods.skus.find(sku => sku.id === skuId)
  if (sku) {
    goods.specs.forEach((item, i) => {
      const val = item.values.find(v => v.name === sku.specs[i].valueName)
      val.selected = true
    })
  }
}
if (props.skuId) initDefaultSelected(props.goods, props.skuId)

// 路径字典(对象)
const getPathMap = skus => {
  const mapping = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      const specs = sku.specs.map(item => item.valueName)
      const powerSet = bwPowerSet(specs)
      powerSet.forEach(arr => {
        const key = arr.join('★')
        if (mapping[key]) mapping[key].push(sku.id)
        else mapping[key] = [sku.id]
      })
    }
  })
  return mapping
}
const pathMap = getPathMap(props.goods.skus)

// 当前选中值的数组
const getSelectedvalues = specs => {
  const arr = []
  specs.forEach(item => {
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}

// 按钮禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((item, i) => {
    const selectedValues = getSelectedvalues(specs)
    item.values.forEach(val => {
      if (val.selected) return // 判断当前是否选中，是就不用判断
      selectedValues[i] = val.name // 拿当前的值按照顺序套入选中的值数组
      const key = selectedValues.filter(value => value).join('★') // 剔除undefined数据，按照分隔符拼接key
      val.disabled = !pathMap[key] // 拿着key去路径字典中查找是否有数据，有可以点击，没有就禁用
    })
  })
}
updateDisabledStatus(props.goods.specs, pathMap)

// 选中与取消选中
const changeSku = (item, val) => {
  if (val.disabled) return // 当按钮是禁用的，阻止程序运行，按钮不可以点
  if (val.selected) val.selected = false // 点击的是已选中，取消当前的选中
  else {
    // 点击的是未选中，先把同一规格都改成未选中，再把当前点击的改成选中
    item.values.forEach(item => { item.selected = false })
    val.selected = true
  }
  updateDisabledStatus(props.goods.specs, pathMap)

  // 将选择的sku信息，通知父组件
  const validSelectedValues = getSelectedvalues(props.goods.specs).filter(v => v)
  // 选择完整的sku组合按钮，才可以拿到这些信息，提交父组件
  if (validSelectedValues.length === props.goods.specs.length) {
    const skuIds = pathMap[validSelectedValues.join('★')]
    const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
    emit('changeSku', {
      skuId: sku.id,
      price: sku.price,
      oldPrice: sku.oldPrice,
      inventory: sku.inventory,
      specsText: sku.specs.reduce((p, c) => `${p} ${c.name}: ${c.valueName}`, '').trim()
    })
    // 不是完整的，给个空对象，父组件需要判断是否规格选择完整，不完整不能加入购物车
  } else emit('changeSku', {})
}
</script>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;

  &.selected {
    border-color: @xtxColor;
  }

  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}

.goods-sku {
  padding-left: 10px;
  padding-top: 20px;

  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      flex: 1;
      color: #666;

      >img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }

      >span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
