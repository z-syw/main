<template>
  <div class="login-callback">
    <LoginHeader>联合登录</LoginHeader>
    <!-- 已绑定 -->
    <section class="container" v-if="isBind">
      <div class="unbind">
        <div class="loading"></div>
      </div>
    </section>

    <!-- 未绑定 -->
    <section class="container" v-else>
      <nav class="tab">
        <a @click="hasAccount = true" :class="{ active: hasAccount }" href="javascript:;">
          <i class="iconfont icon-bind" />
          <span>未和小兔鲜账号绑定，请先绑定</span>
        </a>
        <a @click="hasAccount = false" :class="{ active: !hasAccount }" href="javascript:;">
          <i class="iconfont icon-edit" />
          <span>没有小兔鲜账号，请注册并完善个人信息</span>
        </a>
      </nav>
      <div class="tab-content" v-if="hasAccount">
        <CallbackBind :unionId="unionId" />
      </div>
      <div class="tab-content" v-else>
        <CallbackPatch :unionId="unionId" />
      </div>
    </section>
    <LoginFooter />
  </div>
</template>

<script>
import QC from 'qc'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { userQQLogin } from '@/api/user'
import CallbackPatch from './components/callback-patch.vue'
import CallbackBind from './components/callback-bind.vue'
import LoginFooter from './components/login-footer.vue'
import LoginHeader from './components/login-header.vue'
import Message from '@/components/library/Message'

export default {
  name: 'LoginCallback',
  components: { LoginHeader, LoginFooter, CallbackPatch, CallbackBind },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const hasAccount = ref(true)
    // 控制回调页面用户是否能看到，默认应该看不到，看到的应该是一个loading，QQ登录失败才能看到回调页面
    const isBind = ref(true)
    const unionId = ref(null)
    // 默认认为用户已经注册且绑定，通过QQ的API获取openId（后台接口需要的unionId），然后调用接口进行登录
    // 如果登录失败：说明用户的QQ未和小兔鲜进行绑定（有账号未绑定QQ，没有账号未绑定QQ）
    // 如果登录成功：说明用户已经注册且绑定
    if (QC.Login.check()) {
      QC.Login.getMe(openId => {
        unionId.value = openId
        userQQLogin({ unionId: openId, source: 1 }).then(data => {
          store.commit('user/setUser', data.result) // 存储用户信息
          // 合并购物车
          store.dispatch('cart/mergeLocalCart').then(() => {
            router.push(route.query.redirectUrl || '/')
            Message({ type: 'success', text: 'QQ登录成功' }) // 成功提示
          })
        }).catch(e => {
          isBind.value = false
        })
      })
    }
    return { hasAccount, isBind, unionId }
  }
}
</script>

<style scoped lang='less'>
.container {
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;

    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }

  padding: 25px 0;
  position: relative;
  height: 730px;
}

.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;

  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;

    i {
      font-size: 22px;
      vertical-align: middle;
    }

    span {
      vertical-align: middle;
      margin-left: 4px;
    }

    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}

.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
