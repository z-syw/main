<script>
import { provide } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: { type: [String, Number], default: '' }
  },
  setup(props, { emit }) {
    const activeName = useVModel(props, 'modelValue', emit)
    provide('activeName', activeName)
    const tabClick = (name, index) => {
      activeName.value = name
      // 提供一个tab-click自定义事件
      emit('tab-click', { name, index })
    }
    return { tabClick, activeName }
  },
  render() {
    const panels = this.$slots.default() // 获取默认插槽内容
    const dynamicPanels = []
    panels.forEach(item => {
      if (item.type.name === 'XtxTabsPanel') dynamicPanels.push(item) // 在使用时没有用v-for循环
      else item.children.forEach(item => { dynamicPanels.push(item) }) // 在使用时用了v-for循环
    })

    // 选项卡的导航菜单结构
    const nav = <nav>{
      dynamicPanels.map((item, i) => {
        return <a onClick={() => this.tabClick(item.props.name, i)} class={{ active: item.props.name === this.activeName }} href="javascript:;">{item.props.label}</a>
      })
    }</nav>

    // 返回的内容会进行渲染（在babel帮助下，可以在Vue中写JSX语法）
    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
}
</script>

<style scoped lang="less" >
.xtx-tabs {
  background: #fff;

  >nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    >a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;

      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
