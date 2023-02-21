<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  // data写成函数，每次复用时，返回的都是一个新的
  // data会返回一个对象作为返回值，vue会对该对象进行代理，从而将其转换为响应式数据
  data() {
    return {}
  },
  // methods用来指定实例对象中的方法，是一个对象，可以在它里面定义多个方法
  // 这些方法最终都会被挂载到组件实例上，可以直接通过组件实例来调用这些方法
  methods: {}
}
</script>
