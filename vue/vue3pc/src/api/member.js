import request from '@/utils/request'

/**
 * 会员中心-收藏（商品、专题、品牌）：获取收藏
 * @param {*} collectType 1为商品，2为专题，3位品牌
 * @param {*} pageSize 页尺寸
 * @param {*} page 页码
 * @returns Promise
 */
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'GET', { page, pageSize, collectType })
}
