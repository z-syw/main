import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

// 此函数的目的是监听某个对象是否进入可视区，当进入到可视区之后，调用对应的api拿到数据，返回数据
// 数据懒加载函数，当页面进入到可视区再去请求接口获取数据，提高加载速度
// 进入可视区，发请求，每次发的请求不一样，通过参数传递过来
export const useLazyData = apiFn => {
  const result = ref([])
  const target = ref(null)

  // stop停止观察；target监听的目标元素；isIntersecting是否进入可视区
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      // 进入可视区停止观察，发请求，获取数据
      if (isIntersecting) {
        stop()
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    // 相交的比例大于0触发
    { threshold: 0 }
  )

  return { result, target }
}
