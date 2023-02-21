<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{ goods.categories[1].name }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[0].id}`">{{ goods.categories[0].name }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>

      <div class="goods-info">
        <div class="media">
          <GoodsImages :images="goods.mainPictures" />
        </div>
        <div class="spec">
          <GoodsName :goods="goods" />
          <goodsSku :goods="goods" @changeSku="changeSku" sku-id="1369155862131642369" />
          <XtxNumbox v-model="num" :max="goods.inventory" :label="'数量'" />
          <XtxButton type="primary" size="small" @click="insertCart" style="margin: 20px 0 0 65px;">
            加入购物车
          </XtxButton>
        </div>
      </div>

      <GoodsRelevant :goodsId="goods.id" />
      <div class="goods-footer">
        <div class="goods-article">
          <GoodsTabs />
        </div>
        <div class="goods-aside">
          <GoodsHot :type="1">24小时热销榜</GoodsHot>
          <GoodsHot :type="2">周热销榜</GoodsHot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
import Message from '@/components/library/Message'
import { nextTick, ref, watch, provide } from 'vue'
import GoodsRelevant from './components/goods-relevant'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsImages from './components/goods-images'
import GoodsHot from './components/goods-hot.vue'
import goodsSku from './components/goods-sku.vue'
import GoodsName from './components/goods-name'

const route = useRoute()

// 商品详情：商品详情
const goods = ref(null)
watch(() => route.params.id, newVal => {
  if (newVal && `/product/${newVal}` === route.path) {
    findGoods(route.params.id).then(data => {
      // 每次切换时，先让数据为空，渲染时就不会用到上一次的数据，也可以让使用此数据的组件，重新初始化
      goods.value = null
      // goods.value = null还没生效，就被覆盖了，所以加个nextTick
      nextTick(() => { goods.value = data.result })
      goods.value = data.result
    })
  }
}, { immediate: true })

const changeSku = sku => {
  if (sku.skuId) {
    // 修改商品的价格、库存
    goods.value.price = sku.price
    goods.value.oldPrice = sku.oldPrice
    goods.value.inventory = sku.inventory
  }
  currSku.value = sku
}

// 用户选择的数量，默认为1
const num = ref(1)

// 加入购物车
const store = useStore()
const currSku = ref(null)
const insertCart = () => {
  // 加入购物车之前判断用户选择的规格是否完整
  if (currSku.value && currSku.value.skuId) {
    const { skuId, specsText: attrsText, inventory: stock } = currSku.value
    const { id, name, price, mainPictures } = goods.value
    store.dispatch('cart/insertCart', {
      skuId, // SKUID
      attrsText, // 属性文字，例如“颜色:瓷白色 尺寸：8寸”
      stock, // 库存
      id, // SPUID
      name, // 商品名称
      price, // 加入时价格
      nowPrice: price, // 当前的价格
      picture: mainPictures[0], // 商品图片
      selected: true, // 是否选中
      isEffective: true, // 是否为有效商品
      count: num.value // 数量
    }).then(() => {
      Message({ type: 'success', text: '加入购物车成功' })
    })
  } else Message({ text: '请选择完整规格' })
}

provide('goods', goods)
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;

  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }

  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}

.goods-footer {
  display: flex;
  margin-top: 20px;

  .goods-article {
    width: 940px;
    margin-right: 20px;
  }

  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}

.goods-tabs {
  min-height: 600px;
  background: #fff;
}

.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
