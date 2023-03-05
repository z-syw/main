<template>
  <header>
    <div class="nav">
      <div class="container">
        <ul>
          <li><a href="javascript:;">请先登录</a></li>
          <li><a href="javascript:;">免费注册</a></li>
          <li><a href="javascript:;">我的订单</a></li>
          <li><a href="javascript:;">会员中心</a></li>
          <li><a href="javascript:;">帮助中心</a></li>
          <li><a href="javascript:;">在线客服</a></li>
          <li><a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped lang="less">
.nav {
  height: 53px;
  background-color: #333;

  .container {
    height: 53px;

    ul {
      display: flex;
      justify-content: flex-end;

      li {
        line-height: 53px;

        &::after {
          content: '|';
          width: 1px;
          height: 14px;
          cursor: pointer;
          color: #666666;
        }

        a {
          padding: 0 16px 0 16px;
          color: #dcdcdc;

          &:hover {
            color: #27ba9b;
          }
        }

        &:last-child {
          &::after {
            content: '';
          }

          a {
            padding-right: 0;
          }

          i {
            margin-right: 2px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
