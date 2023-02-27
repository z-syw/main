<template>
  <div class="sub-filter" v-if="filterData && filterLoading === false">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a href="javascript:;" v-for="item in filterData.brands" :key="item.id"
          :class="{ active: item.id === filterData.brands.selectedBrand }" @click="changeBrand(item.id)">
          {{ item.name }}
        </a>
      </div>
    </div>

    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{ item.name }}：</div>
      <div class="body">
        <a href="javascript:;" v-for="prop in item.properties" :key="prop.id"
          :class="{ active: prop.id === item.selectedAttr }" @click="changeProp(item, prop.id)">
          {{ prop.name }}
        </a>
      </div>
    </div>
  </div>

  <div v-else class="sub-filter">
    <XtxSkeleton animated width="800px" height="40px" />
    <XtxSkeleton animated width="800px" height="40px" />
    <XtxSkeleton animated width="600px" height="40px" />
    <XtxSkeleton animated width="600px" height="40px" />
    <XtxSkeleton animated width="600px" height="40px" />
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'

export default {
  name: 'SubFilter',
  setup(prop, { emit }) {
    const route = useRoute()

    // 骨架效果在页面初始化时会有一次，但是当我们有数据在切换页面时，并不会显示骨架效果，所以设置个类似loading效果
    const filterLoading = ref(false)
    const filterData = ref(null)
    watch(() => route.params.id, newVal => {
      // 变化后的ID有值且属于二级菜单
      if (newVal && `/category/sub/${newVal}` === route.path) {
        filterLoading.value = true
        findSubCategoryFilter({ id: route.params.id }).then(data => {
          data.result.brands.selectedBrand = null
          data.result.brands.unshift({ id: null, name: '全部' })
          data.result.saleProperties.forEach(item => {
            item.selectedAttr = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          filterData.value = data.result
          filterLoading.value = false
        })
      }
    }, { immediate: true })

    // 品牌
    const changeBrand = id => {
      if (filterData.value.selectedBrand === id) return
      filterData.value.brands.selectedBrand = id
      emit('filter-change', getFilterParams())
    }

    // 其它
    const changeProp = (item, id) => {
      if (item.selectedProp === id) return
      item.selectedAttr = id
      emit('filter-change', getFilterParams())
    }

    // 获取筛选参数的函数
    const getFilterParams = () => {
      // 参考数据 {brandId: '', attrs: [{groupName: '颜色', propertyName: '蓝色'}, ...]}
      const obj = { brandId: null, attrs: [] }
      // 品牌
      obj.brandId = filterData.value.selectedBrand
      // 其它
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedProp) {
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      if (obj.attrs.length === 0) obj.attrs = null // 等于null，这个字段不会发请求给后台。等于''不行。
      return obj
    }

    return { filterData, filterLoading, changeBrand, changeProp }
  }
}
</script>

<style scoped lang="less">
.sub-filter {
  background: #fff;
  padding: 25px;

  .item {
    display: flex;
    line-height: 40px;

    .head {
      width: 80px;
      color: #999;
    }

    .body {
      flex: 1;

      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;

        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }

  .xtx-skeleton {
    padding: 10px 0;
  }
}
</style>
