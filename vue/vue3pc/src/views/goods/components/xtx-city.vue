<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{active: visible}">
      <span class="placeholder" v-if="fullLocation">{{ fullLocation }}</span>
      <span class="value" v-else>请选择配送地址</span>
      <i class="iconfont icon-angle-down" />
    </div>

    <div class="option" v-if="visible">
      <div class="loading" v-if="loading" />
      <template v-else>
        <span @click="changeItem(item)" class="ellipsis" v-for="item in currList" :key="item.code">
          {{ item.name }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onClickOutside } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'

defineProps({
  fullLocation: { type: String, default: '' }
})

const emit = defineEmits(['change'])

// 控制显示隐藏城市
const visible = ref(false)
// 存储城市数据
const allCityData = ref([])
// loading效果
const loading = ref(false)

// 隐藏城市
const close = () => { visible.value = false }
// 点击外面隐藏城市
const target = ref(null)
// 参数一：监听哪个元素；参数二：点击了元素外，触发的逻辑
onClickOutside(target, () => { close() })
// 这个方法用来调用open和close
const toggle = () => { visible.value ? close() : open() }

// 显示城市
const open = () => {
  visible.value = true // 显示城市
  loading.value = true // 拿到数据前，数据太大，可能会出现空白，打开loading
  getCityData().then(data => {
    allCityData.value = data // 保存城市数据
    loading.value = false // 拿到数据后，关闭loading
  })
  // 清空之前的选择
  for (const key in changeResult) {
    changeResult[key] = ''
  }
}

const changeResult = reactive({
  provinceCode: '', // 省code
  provinceName: '', // 省name
  cityCode: '', // 市code
  cityName: '', // 市name
  countyCode: '', // 区code
  countyName: '', // 区name
  fullLocation: ''
})
const changeItem = item => {
  // 省
  if (item.level === 0) {
    changeResult.provinceCode = item.code
    changeResult.provinceName = item.name
  }
  // 市
  if (item.level === 1) {
    changeResult.cityCode = item.code
    changeResult.cityName = item.name
  }
  // 区
  if (item.level === 2) {
    changeResult.countyCode = item.code
    changeResult.countyName = item.name
    close() // 选完了，关闭对话框
    changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
    emit('change', changeResult)
  }
}

// 通过计算属性，根据城市数据，得出当前需要显示的省 市 区
const currList = computed(() => {
  let list = allCityData.value // 默认显示省
  // 市
  if (changeResult.provinceCode && changeResult.provinceName) {
    list = list.find(item => item.code === changeResult.provinceCode).areaList
  }
  // 区
  if (changeResult.cityCode && changeResult.cityName) {
    list = list.find(item => item.code === changeResult.cityCode).areaList
  }
  return list
})

// 获取城市数据
const getCityData = () => {
  return new Promise(resolve => {
    // 本地有缓存，取出缓存
    if (window.cityData) resolve(window.cityData)
    // 本地没有缓存，发请求，然后缓存
    else {
      axios.get('https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json').then(res => {
        window.cityData = res.data
        resolve(res.data)
      })
    }
  })
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;

  .select {
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;

    &.active {
      background: #fff;
    }

    .placeholder {
      color: #999;
    }

    .value {
      color: #666;
      font-size: 12px;
    }

    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }

  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;

    >span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;

      &:hover {
        background: #f5f5f5;
      }
    }

    .loading {
      height: 290px;
      width: 100%;
      background: url(@/assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
