export const imagerror = {
  // 当指令所在的元素，被插入到页面中时执行
  inserted(el, binding) {
    // el：指令所在的元素；binding：指令的相关信息对象
    // 当图片有地址，但是地址没有加载成功时，会报错，会触发图片的onerror事件
    el.onerror = () => (el.src = binding.value)
  }
}
