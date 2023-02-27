import Mock from 'mockjs'
import qs from 'qs' // node.js提供的

// 基本配置
Mock.setup({
  timeout: '500-1000' // 随机延时500-1000毫秒，模拟网络延迟
})

// 会员中心-收藏（商品、专题、品牌）：获取收藏
// 参数一：接口地址路径，写成正则形式；参数二：请求方式；参数三：返回数据，需要写一些逻辑，所以写成函数返回数据形式
Mock.mock(/\/member\/collect/, 'get', config => {
  // config可以拿到前端请求过来的数据
  // 随机数据的逻辑
  const queryString = config.url.split('?')[1] // 拿到字符串，因为是get请求（url上？传参的格式）
  // queryObject就是前端请求的数据
  const queryObject = qs.parse(queryString) // 把字符串转成对象数组
  const items = []
  for (let i = 0; i < +queryObject.pageSize; i++) {
    // 模拟随机多条数据
    items.push(
      Mock.mock({
        id: '@id', // id
        name: '@ctitle(10,20)', // 名称
        des: '@ctitle(4,10)', // 描述
        price: '@float(100,200,2,2)', // 商品-商品价格
        // Mock.mock('@id') 模拟随机单条数据
        picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock(
          '@integer(1,8)'
        )}.jpg` // 图片
      })
    )
  }
  return {
    msg: '获取收藏商品成功',
    result: {
      counts: 35, // 总记录数，假设35条数据，多少条都行
      pageSize: +queryObject.pageSize, // 页尺寸（一页几条数据）
      page: +queryObject.page, // 当前页码
      items // 数据集合
    }
  }
})
