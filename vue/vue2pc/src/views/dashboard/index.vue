<template>
  <div class="dashboard-container">
    <el-card class="header-card">
      <div>
        <div class="fl headL">
          <div class="headImg">
            <img v-imagerror="defaultImg" :src="userInfo.staffPhoto">
          </div>
          <div class="headInfoTip">
            <p class="firstChild">{{ userInfo.username }}，祝你开心每一天！</p>
          </div>
        </div>
      </div>
    </el-card>

    <el-row type="flex" justify="space-between">
      <!-- 左侧内容 -->
      <el-col :span="13" style="padding-right:26px">
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>工作日历</span>
          </div>
          <WorkCalendar />
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :span="11">
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>绩效指数</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import defaultImg from '@/assets/common/head.jpg'
import WorkCalendar from './components/work-calendar.vue'

export default {
  name: 'Dashboard',
  components: { WorkCalendar },
  data() {
    return {
      defaultImg
    }
  },
  computed: {
    ...mapGetters(['name']),
    ...mapState('user', ['userInfo'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 10px;

  li {
    list-style: none;
  }

  .headImg {
    float: left;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #999;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .headInfoTip {
    padding: 25px 0 0;
    margin-left: 120px;

    p {
      padding: 0 0 15px;
      margin: 0;

      &.firstChild {
        font-size: 24px;
      }

      &.lastChild {
        font-size: 20px;
        color: #7f8c8d;
      }
    }
  }
}

.box-card {
  padding: 5px 10px;
  margin-top: 20px;

  .header {
    span {
      color: #2c3e50;
      font-size: 24px;
    }

    .item {
      color: #97a8be;
      float: right;
      padding: 3px 0;
    }
  }

  .headTit {
    span {
      border-bottom: 4px solid #8a97f8;
      padding-bottom: 10px;
    }
  }
}

.header-card {
  position: relative;

  .header {
    position: absolute;
    right: 20px;
    top: 15px;
    z-index: 1;
  }
}

.advContent {
  background: #fff;
  border-radius: 5px 5px 0px 0px;

  .title {
    font-size: 16px;
    padding: 20px;
    font-weight: bold;
    border-bottom: solid 1px #ccc;
  }

  .contentItem {
    padding: 0 30px;
    min-height: 350px;

    .item {
      display: flex;
      padding: 18px 0 10px;
      border-bottom: solid 1px #ccc;

      .col {
        color: #8a97f8;
      }

      img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        margin-right: 10px;
      }

      p {
        padding: 0 0 8px;
      }
    }
  }
}

.noticeList {
  margin: 0;
  padding: 0;
}

.sideNav,
.sideLink {
  padding: 30px 0 12px;

  .sideBtn {
    padding: 16px 26px;
    font-size: 16px;
    margin: 10px 5px;
  }
}

.sideLink {
  text-align: center;

  .iconGuide {
    background-position: 0 0;
  }

  .iconHelp {
    background-position: -224px 0;
  }

  .iconTechnology {
    background-position: -460px 0;
  }
}
</style>
