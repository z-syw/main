import request from '@/utils/request'

/**
 * 商品详情：商品信息-库存价格是否有效（支持本地购物车）
 * @param {String} skuId 商品SKUID
 * @returns Promsie
 */
export const getNewCartGoods = skuId => request(`/goods/stock/${skuId}`, 'GET')

/**
 * 购物车：合并购物车
 * @param {String} skuId 商品skuId
 * @param {Boolean} selected 是否选中
 * @param {Number} count 数量
 * @returns Promise
 */
export const mergeLocalCart = arr => request('/member/cart/merge', 'POST', arr)

/**
 * 购物车：加入购物车
 * @param {String} skuId 商品skuId
 * @param {Number} count 数量
 * @returns Promise
 */
export const insertCart = ({ skuId, count }) => request('/member/cart', 'POST', { skuId, count })

/**
 * 购物车：购物车列表
 * @returns Promise
 */
export const findCartList = () => request('/member/cart', 'GET')
