import { findCartList, getNewCartGoods, mergeLocalCart, insertCart } from '@/api/cart'

export default {
  namespaced: true,
  state: () => ({ list: [] }),

  mutations: {
    // 加入购物车
    insertCart: (state, payload) => {
      const sameIndex = state.list.findIndex(item => item.skuId === payload.skuId)
      // 如果有相同的商品
      if (sameIndex >= 0) {
        const count = state.list[sameIndex].count // 查询它的数量
        payload.count += count // 累加到payload上
        state.list.splice(sameIndex, 1) // 删除原来的商品
        state.list.unshift(payload) // 保存到最新位置
        // 如果没有相同的商品，直接保存在最新位置
      } else state.list.unshift(payload)
    },

    // 获取购物车列表
    setCartList: (state, payload) => (state.list = payload),

    // 未登录，更新购物车商品
    updateCart: (state, payload) => {
      const updateGoods = state.list.find(item => item.skuId === payload.skuId)
      for (const k in payload) {
        if (payload[k] !== null && payload[k] !== undefined && payload[k] !== '') updateGoods[k] = payload[k]
      }
    },

    // 删除购物车商品
    deleteCart: (state, skuId) => {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    }
  },

  actions: {
    // 加入购物车
    insertCart: (context, payload) => {
      return new Promise(resolve => {
        // 在cart模块获取user模块中的信息，使用rootState
        if (context.rootState.user.profile.token) {
          insertCart({ skuId: payload.skuId, count: payload.count })
            .then(() => {
              // 加入购物车之后，重新拉取数据
              findCartList().then(res => {
                context.commit('insertCart', res.result)
                resolve()
              })
            })
        } else {
          context.commit('insertCart', payload)
          resolve()
        }
      })
    },

    // 获取购物车列表
    findCartList: context => {
      return new Promise(resolve => {
        if (context.rootState.user.profile.token) {
          // 登录之后，获取购物车列表
          findCartList().then(res => {
            context.commit('setCartList', res.result)
            resolve()
          })
        } else {
          // 更新购物车商品
          const promiseArr = context.state.list.map(item => getNewCartGoods(item.skuId))
          Promise.all(promiseArr).then(result => {
            result.forEach((item, i) => {
              context.commit('updateCart', {
                skuId: context.state.list[i].skuId,
                ...item.result
              })
            })
          })
          resolve()
        }
      })
    },

    // 单选/修改数量
    updateCart: (context, payload) => {
      return new Promise(resolve => {
        if (context.rootState.user.profile.token) {
        } else {
          context.commit('updateCart', payload)
          resolve()
        }
      })
    },

    // 全选
    checkAllCart: (context, selected) => {
      return new Promise(() => {
        if (context.rootState.user.profile.token) {
        } else {
          context.getters.validList.forEach(item => (context.commit('updateCart', { skuId: item.skuId, selected })))
        }
      })
    },

    // 删除选中/失效购物车商品
    batchDeleteCart: (context, isTrue) => {
      if (context.rootState.user.profile.token) {
      } else {
        context.getters[isTrue ? 'invalidList' : 'selectedList'].forEach(item => { context.commit('deleteCart', item.skuId) })
      }
    },

    // 删除单条购物车商品
    deleteCart: (context, skuId) => {
      return new Promise(resolve => {
        if (context.rootState.user.profile.token) {
        } else {
          context.commit('deleteCart', skuId)
          resolve()
        }
      })
    },

    // 合并购物车
    mergeLocalCart: async context => {
      const arr = context.getters.validList.map(item => ({
        skuId: item.skuId,
        selected: item.selected,
        count: item.count
      }))
      await mergeLocalCart(arr)
      context.commit('setCartList', []) // 合并成功，将本地购物车删除
    }
  },

  getters: {
    // 使用getters得到有效商品列表
    // stock:库存 isEffective:是否为有效商品
    validList: state => state.list.filter(item => item.stock > 0 && item.isEffective),

    // 从有效商品列表中，得到有效商品总件数
    validTotal: (state, getters) => getters.validList.reduce((prev, item) => prev + item.count, 0),

    // 从有效商品列表中，得到有效总金额
    validAmoun: (state, getters) => (getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100),

    // 从有效商品列表中，得到已选商品列表
    selectedList: (state, getters) => getters.validList.filter(item => item.selected === true),

    // 从有效的已选商品列表，得到已选商品总件数
    selectedTotal: (state, getters) => getters.selectedList.reduce((prev, item) => prev + item.count, 0),

    // 从有效的已选商品列表，得到已选商品总金额
    selectedAmount: (state, getters) => (getters.selectedList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100),

    // 是否全选
    // 先判断是否有商品
    // 有效商品列表的长度 === 已选商品列表的长度
    isCheckAll: (state, getters) => (getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length),

    // 无效商品列表
    invalidList: state => state.list.filter(item => item.stock <= 0 || item.isEffective === false)
  }
}
