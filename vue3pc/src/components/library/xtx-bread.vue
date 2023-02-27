<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render() {
    // 用法：
    // 1 单文件组件中，template标签去掉，render函数的返回值就是组件内容
    // 2 vue2中h函数传参进来render: h  => {return h()}，vue3中h函数是导入进来
    // 3 h函数可以动态创建结构。参数一：标签名字；参数二：标签属性对象；参数三：子节点

    // 需求：
    // 1 创建父容器
    // 2 获取默认插槽内容
    // 3 去掉xtx-bread-item组件的i标签，由render函数动态创建
    // 4 遍历插槽，得到一个动态创建的节点，最后一个item不加i标签
    // 5 把动态创建的节点渲染到父容器标签中

    // 注意：
    // 不要在 xtx-bread 组件插槽写注释，也会被解析

    const items = this.$slots.default()
    const dymaincItems = []
    items.forEach((item, i) => {
      dymaincItems.push(item)
      if (i < (items.length - 1)) dymaincItems.push(h('i', { class: 'iconfont icon-angle-right' }))
    })
    return h('div', { class: 'xtx-bread' }, dymaincItems)
  }
}
</script>

<style lang="less">
.xtx-bread {
  display: flex;
  padding: 25px 10px;

  &-item {
    a {
      color: #666;
      transition: all 0.4s;

      &:hover {
        color: @xtxColor;
      }
    }
  }

  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
