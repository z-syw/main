import request from '@/utils/request'

// 商品详情：商品详情
export const findGoods = id => request('/goods', 'GET', { id })

// 商品详情：同类推荐(也支持猜你喜欢)
export const findRelGoods = data => request('/goods/relevant', 'GET', data)

// 商品详情：热销推荐
export const findHotGoods = data => request('/goods/hot', 'GET', data)

// 商品详情：商品的评价信息
export const findCommentInfoByGoods = id =>
  // axios遇到https开头的路径，不会加上基准路径
  request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'GET')

// 商品详情：评价分页数据
export const findCommentListByGoods = (id, params) =>
  request(
    `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,
    'GET',
    params
  )
