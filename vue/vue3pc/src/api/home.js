import request from '@/utils/request'

// 首页模块：首页-热门品牌
export const findBrand = (limit = 6) =>
  request('/home/brand', 'get', { limit })

// 首页模块：首页-广告区域(pc-小程序)
export const findBanner = () => request('/home/banner', 'get')

// 首页-新鲜好物
export const findNew = () => request('/home/new', 'get')

// 首页-人气推荐
export const findHot = () => request('/home/hot', 'get')

// 首页-产品区块
export const findGoods = () => request('/home/goods', 'get')

// 首页-最新专题
export const findSpecial = () => request('/home/special', 'get')
