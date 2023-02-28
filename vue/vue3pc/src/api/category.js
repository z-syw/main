import request from '@/utils/request'

// 首页模块：首页-全部分类（包含推荐商品）
export const findAllCategory = () => request('/home/category/head', 'GET')

// 商品分类：一级类目-PC
export const findTopCategory = id => request('/category', 'GET', { id })

// 商品分类：二级类目-筛选条件-PC
export const findSubCategoryFilter = id =>
  request('/category/sub/filter', 'GET', id)

// 商品分类：商品列表_临时
export const findSubCategoryGoods = params =>
  request('/category/goods/temporary', 'POST', params)
