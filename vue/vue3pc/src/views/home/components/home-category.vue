<template>
  <div class="home-category" @mouseleave="categoryId = null">
    <ul class="menu">
      <li v-for="item in menuList" :key="item.id" @mouseenter="categoryId = item.id"
        :class="{ active: categoryId === item.id }">
        <!-- 一级分类 -->
        <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        <!-- 二级分类 -->
        <template v-if="item.children">
          <RouterLink :to="`/category/sub/${sub.id}`" v-for="sub in item.children" :key="sub.id">
            {{ sub.name }}
          </RouterLink>
        </template>
        <!-- 骨架效果 -->
        <template v-else>
          <XtxSkeleton height="18px" width="60px" bg="rgba(255, 255, 255, .2)" animated style="margin-right: 5px" />
          <XtxSkeleton height="18px" width="60px" bg="rgba(255, 255, 255, .2)" animated />
        </template>
      </li>
    </ul>
    <!-- 弹层 -->
    <div class="layer" :style="{ display: categoryId ? 'block' : 'none' }">
      <h4>
        {{ currCategory && currCategory.id === "brand" ? "品牌" : "分类"}}
        推荐<small>根据您的购买或浏览记录推荐</small>
      </h4>
      <ul v-if="currCategory && currCategory.goods">
        <li v-for="item in currCategory.goods" :key="item.id">
          <a href="javascript:;">
            <img :src="item.picture" />
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </a>
        </li>
      </ul>
      <!-- 品牌 -->
      <ul v-if="currCategory && currCategory.brands">
        <li class="brand" v-for="brand in currCategory.brands" :key="brand.id">
          <a href="javascript:;">
            <img :src="brand.picture" />
            <div class="info">
              <p class="place">
                <i class="iconfont icon-dingwei"></i>{{ brand.place }}
              </p>
              <p class="name ellipsis">{{ brand.name }}</p>
              <p class="desc ellipsis-2">{{ brand.desc }}</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'
import { findBrand } from '@/api/home'

export default {
  name: 'HomeCategory',
  setup() {
    const store = useStore()

    // 品牌
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-children', name: '品牌推荐' }],
      brands: []
    })
    // 最终使用的数据 = 9个分类 + 1个品牌，且每个分类有两个子分类
    const menuList = computed(() => {
      const list = store.state.category.list.map(item => {
        return {
          id: item.id, // 一级分类id
          name: item.name, // 一级分类名字
          children: item.children?.slice(0, 2), // 子分类，取出来两个
          goods: item.goods // 鼠标经过九个分类显示的推荐商品，从一级分类下取出
        }
      })
      list.push(brand)
      return list
    })

    // 得到弹层的推荐数据
    // 存储用户鼠标选择的哪一个分类？这么多数据，不存储谁知道用户选择的是哪个一。什么时候存储？当用户进入时存储。
    // 存储完后，从数据中计算出用户选择的那个
    const categoryId = ref(null)
    const currCategory = computed(() => menuList.value.find(item => item.id === categoryId.value)
    )

    // 获取品牌数据
    findBrand().then(data => { brand.brands = data.result })

    return { menuList, categoryId, currCategory }
  }
}
</script>

<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;

  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;

      &:hover,
      &.active {
        background: @xtxColor;
      }

      a {
        margin-right: 4px;
        color: #fff;

        &:first-child {
          font-size: 16px;
        }
      }
    }
  }

  // 弹层样式
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    // display: none;
    padding: 0 15px;

    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;

      small {
        font-size: 16px;
        color: #666;
      }
    }

    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;

        &:nth-child(3n) {
          margin-right: 0;
        }

        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;

          &:hover {
            background: #e3f9f4;
          }

          img {
            width: 95px;
            height: 95px;
          }

          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;

            .name {
              font-size: 16px;
              color: #666;
            }

            .desc {
              color: #999;
            }

            .price {
              font-size: 22px;
              color: @priceColor;

              i {
                font-size: 16px;
              }
            }
          }
        }
      }

      // 品牌样式
      li.brand {
        height: 180px;

        a {
          align-items: flex-start;

          img {
            width: 120px;
            height: 160px;
          }

          .info {
            p {
              margin-top: 8px;
            }

            .place {
              color: #999;
            }
          }
        }
      }
    }
  }

  // &:hover {
  //   .layer {
  //     display: block;
  //   }
  // }
}
</style>
