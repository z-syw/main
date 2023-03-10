<template>
  <div class="xtx-cart-page">
    <div class="container">
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckbox :modelValue="$store.getters['cart/isCheckAll']" @change="checkAll">全选</XtxCheckbox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>

          <!-- 有效商品 -->
          <tbody>
            <tr v-if="$store.getters['cart/validList'].length === 0">
              <td colspan="6">
                <CartNone />
              </td>
            </tr>

            <tr v-for="goods in $store.getters['cart/validList']" :key="goods.skuId">
              <td>
                <XtxCheckbox :modelValue="goods.selected" @change="$event => checkOne(goods.skuId, $event)" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`">
                    <img :src="goods.picture" />
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{ goods.name }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ goods.nowPrice }}</p>
                <p v-if="goods.price - goods.nowPrice > 0">
                  比加入时降价
                  <span class="red">&yen;{{ goods.price - goods.nowPrice }}</span>
                </p>
              </td>
              <td class="tc">
                <XtxNumbox :max="goods.stock" :modelValue="goods.count"
                  @change="$event => changeCount(goods.skuId, $event)" />
              </td>
              <td class="tc">
                <p class="f16 red">
                  &yen;{{
                      Math.round(goods.nowPrice * 100 * goods.count) / 100
                  }}
                </p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p>
                  <a class="green" href="javascript:;" @click="delCart(goods.skuId)">删除</a>
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>

          <!-- 无效商品 -->
          <tbody v-if="$store.getters['cart/invalidList'].lenght">
            <tr>
              <td colspan="6">
                <h3 class="tit">失效商品</h3>
              </td>
            </tr>
            <tr v-for="goods in $store.getters['cart/invalidList']" :key="goods.skuId">
              <td>
                <XtxCheckbox style="color: #eee" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`">
                    <img :src="goods.picture" />
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{ goods.name }}</p>
                    <p class="attr">{{ goods.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ goods.nowPrice }}</p>
              </td>
              <td class="tc">{{ goods.count }}</td>
              <td class="tc">
                <p class="f16 red">
                  &yen;{{
                      Math.round(goods.nowPrice * 100 * goods.count) / 100
                  }}
                </p>
              </td>
              <td class="tc">
                <p>
                  <a class="green" href="javascript:;" @click="delCart(goods.skuId)">删除</a>
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox :modelValue="$store.getters['cart/isCheckAll']">全选</XtxCheckbox>
          <a href="javascript:;" @click="batchDeleteCart()">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ $store.getters['cart/validTotal'] }} 件商品， 已选择
          {{ $store.getters['cart/selectedTotal'] }} 件， 商品合计：<span class="red">¥{{ $store.getters['cart/selectedAmount']
          }}</span>
          <XtxButton type="primary">下单结算</XtxButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import Confirm from '@/components/library/Confirm'
import CartNone from './components/cart-none.vue'

export default {
  name: 'XtxCartPage',
  components: { CartNone },
  setup() {
    // 单选
    const store = useStore()
    const checkOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', { skuId, selected })
    }

    // 全选
    const checkAll = selected => {
      store.dispatch('cart/checkAllCart', selected)
    }

    // 删除单条购物车商品
    const delCart = skuId => {
      Confirm({ title: '温馨提示', text: '确认删除' }).then(() => {
        store.dispatch('cart/deleteCart', skuId)
      }).catch(() => { })
    }

    // 删除选中/失效的购物车商品
    const batchDeleteCart = isTrue => {
      Confirm({ title: '温馨提示', text: `是否${isTrue ? '清空失效' : '删除选中'}商品` }).then(() => {
        store.dispatch('cart/batchDeleteCart', isTrue)
      }).catch(() => { })
    }

    // 修改数量
    const changeCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }

    return { checkOne, checkAll, delCart, batchDeleteCart, changeCount }
  }
}
</script>

<style scoped lang="less">
.tc {
  text-align: center;

  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}

.red {
  color: @priceColor;
}

.green {
  color: @xtxColor;
}

.f16 {
  font-size: 16px;
}

.goods {
  display: flex;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
  }

  >div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;

    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}

.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;

  .xtx-checkbox {
    color: #999;
  }

  .batch {
    a {
      margin-left: 20px;
    }
  }

  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}

.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}

.xtx-cart-page {
  padding-top: 15px;

  .cart {
    background: #fff;
    color: #666;

    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;

      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;

        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }

      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
