// 实现使用函数调用xtx-message组件的逻辑
// 这个函数将来可以导入直接使用，也可以挂载在vue实例原型上
// 导入import Message from 'Message.js' 使用Message({type: 'error', text: '提示文本'})
// this.$message({type: 'error', text: '提示文本'})

import { createVNode, render } from 'vue'
// 导入消息提示组件
import XtxMessage from './xtx-message.vue'

// 准备一个装载消息提示组件的DOM容器
const div = document.createElement('div')
// 给这个DOM容器添加一个class，没有任何作用，就是个标识，不加也没事
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器标识
let timer = null

export default ({ type, text }) => {
  // 1 使用vue提供的createVNode方法，将消息提示组件编译为虚拟的DOM节点(vnode是个变量，此时是放在内存里的)
  const vnode = createVNode(XtxMessage, { type, text }) // 参数一：组件对象；参数二：属性对象(props)
  // 2 使用vue提供的render函数，将虚拟节点渲染到容器中
  render(vnode, div) // 参数一：虚拟节点；参数二：DOM容器
  // 3 开启定时器，移出DOM容器内容，先销毁一次，是个好习惯，防止多次添加定时器
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
