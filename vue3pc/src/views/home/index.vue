<template>
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图 -->
      <Homebanner />
    </div>
  </div>

  <!-- 新鲜好物 -->
  <HomeNew />
  <!-- 人气推荐 -->
  <HomeHot />
  <!-- 热门品牌 -->
  <HomeBrand />
  <!-- 产品区块 -->
  <HomeProduct />
  <!-- 最新专题 -->
  <HomeSpecial />
</template>

<script>
import HomeBrand from './components/home-brand.vue'
import HomeSpecial from './components/home-special.vue'
import HomeCategory from './components/home-category.vue'
import HomeProduct from './components/home-product.vue'
import Homebanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'

export default {
  name: 'HomeView',
  components: { HomeCategory, Homebanner, HomeNew, HomeHot, HomeBrand, HomeProduct, HomeSpecial }
}
</script>
