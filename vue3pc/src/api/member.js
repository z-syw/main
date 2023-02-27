import request from '@/utils/request'

// 会员中心-收藏（商品、专题、品牌）：获取收藏
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'GET', { page, pageSize, collectType })
}
