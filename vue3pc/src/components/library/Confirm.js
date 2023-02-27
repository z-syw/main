import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm.vue'

const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    // 点击确认按钮，触发reslove同时销毁组件
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    // 点击取消按钮，出发reject同时销毁组件
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    const vnode = createVNode(XtxConfirm, { title, text, submitCallback, cancelCallback })
    render(vnode, div)
  })
}
