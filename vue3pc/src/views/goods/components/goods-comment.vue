<template>
  <div class="goods-comment">
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>{{ commentInfo.salesCount }}</span><span>人购买</span></p>
        <p><span>{{ commentInfo.praisePercent }}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a v-for="(item, i) in commentInfo.tags" :key="item.id" href="javascript:;" @click="changeTag(i)"
            :class="{ active: currTagIndex === i }"> {{ item.title }}（{{ item.tagCount }}）</a>
        </div>
      </div>
    </div>

    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a href="javascript:;" @click="changeSort(null)" :class="{ active: reqParams.sortField === null }">默认</a>
      <a href="javascript:;" @click="changeSort('createTime')"
        :class="{ active: reqParams.sortField === 'createTime' }">最新</a>
      <a href="javascript:;" @click="changeSort('praiseCount')"
        :class="{ active: reqParams.sortField === 'praiseCount' }">最热</a>
    </div>
  </div>

  <!-- 评论列表 -->
  <div class="list" v-if="commentList">
    <div class="item" v-for="item in commentList" :key="item.id">
      <div class="user">
        <img :src="item.member.avatar" />
        <span>{{ formatNickname(item.member.nickname) }}</span>
      </div>
      <div class="body">
        <div class="score">
          <i v-for="i in item.score" :key="i + '1'" class="iconfont icon-wjx01" />
          <i v-for="i in 5 - item.score" :key="i + '2'" class="iconfont icon-wjx02" />
          <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
        </div>
        <div class="text">{{ item.content }}</div>
        <!-- 图片预览 -->
        <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures" />
        <div class="time">
          <span>{{ item.createTime }}</span>
          <span class="zan"><i class="iconfont icon-dianzan"></i> {{ item.praiseCount }}</span>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <xtx-pagination v-if="total" :total="total" :page-size="reqParams.pageSize" :currrent-page="reqParams.page"
      @current-change="changePagerFn" />
  </div>
</template>

<script setup>
import GoodsCommentImage from './goods-comment-image'
import { findCommentInfoByGoods, findCommentListByGoods } from '@/api/product'
import { inject, reactive, ref, watch } from 'vue'

const goods = inject('goods')

// 商品详情：商品的评价信息
const commentInfo = ref(null)
findCommentInfoByGoods(goods.value.id).then(data => {
  // 有图和评价是固定的，后台没有给这两个，所以在这里手动处理下
  data.result.tags.unshift({ type: 'img', title: '有图', tagCount: data.result.hasPictureCount })
  data.result.tags.unshift({ type: 'all', title: '全部评价', tagCount: data.result.evaluateCount })
  commentInfo.value = data.result
})

// 后台需要的数据
const reqParams = reactive({
  page: 1, // 页码
  pageSize: 10, // 页尺寸
  hasPicture: null, // 是否有图
  tag: null, // 标签。示例：质量好
  sortField: null // 排序字段，可选值范围[praiseCount热度,createTime最新]
  // sortMethod: desc // 排序方法，可选值范围[asc desc]默认desc降序
})
// 改变筛选条件
const changeSort = type => {
  reqParams.sortField = type
  reqParams.page = 1
}
// 激活的索引
const currTagIndex = ref(0)
// 改变索引并改变筛选条件
const changeTag = i => {
  currTagIndex.value = i
  const currTag = commentInfo.value.tags[i]
  if (currTag.type === 'all') { // 全部评价
    reqParams.hasPicture = null
    reqParams.tag = null
  } else if (currTag.type === 'img') { // 有图
    reqParams.hasPicture = true
    reqParams.tag = null
  } else { // 其它
    reqParams.hasPicture = null
    reqParams.tag = currTag.title
  }
  reqParams.page = 1
}
// 商品详情：评价分页数据
const commentList = ref(null)
const total = ref(0)
// 初始化或者筛选条件改变后，获取列表数据，发请求
watch(reqParams, () => {
  findCommentListByGoods(goods.value.id, reqParams).then(data => {
    commentList.value = data.result.items
    total.value = data.result.counts
  })
}, { immediate: true })
// 定义转换数据的函数（对应vue2.0的过滤器）
const formatSpecs = specs => specs.reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, '').trim()
const formatNickname = nickname => nickname.substr(0, 1) + '****' + nickname.substr(-1)

// 实现分页切换
const changePagerFn = newPage => { reqParams.page = newPage }
</script>

<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;

    .data {
      width: 340px;
      display: flex;
      padding: 20px;

      p {
        flex: 1;
        text-align: center;

        span {
          display: block;

          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }

          &:last-child {
            color: #999;
          }
        }
      }
    }

    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;

      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }

      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;

        >a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;

          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }

          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }

  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;

    >span {
      margin-left: 20px;
    }

    >a {
      margin-left: 30px;

      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }

}

.list {
  padding: 0 20px;

  .item {
    display: flex;
    padding: 25px 10px;
    border-bottom: 1px solid #f5f5f5;

    .user {
      width: 160px;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }

      span {
        padding-left: 10px;
        color: #666;
      }
    }

    .body {
      flex: 1;

      .score {
        line-height: 40px;

        .iconfont {
          color: #ff9240;
          padding-right: 3px;
        }

        .attr {
          padding-left: 10px;
          color: #666;
        }
      }
    }

    .text {
      color: #666;
      line-height: 24px;
    }

    .time {
      color: #999;
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}
</style>
