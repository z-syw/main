<template>
  <div class="login-page" v-if="isBind">
    <cp-nav-bar />
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form" @submit="bind">
      <van-field name="mobile" placeholder="请输入手机号" :rules="mobileRules" v-model="mobile" />
      <van-field name="code" placeholder="请输入验证码" :rules="codeRules" v-model="code">
        <template #button>
          <span class="btn-send" @click="send" :class="{ active: time > 0 }">
            {{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}
          </span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">立即绑定</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mobileRules, codeRules } from '@/utils/rules'
import { bindMobileAPI, loginByQQAPI } from '@/services/user'
import { showSuccessToast, type FormInstance } from 'vant'
import { useMobileCode } from '@/composable'
import type { User } from '@/types/user'
import { useUserStore } from '@/stores'

const store = useUserStore()
const router = useRouter()

// 登录--绑定用户新-三方登录绑定手机号API，需要的三个参数
const openId = ref('')
const mobile = ref('')
const code = ref('')

// 假设用户QQ已经绑定手机号了，就不需要给用户看到这个页面了，默认用户看不到
const isBind = ref(false)

// 绑定成功就代表登录成功了
// 1. 登录成功之后，存储用户信息
// 2. 在qq登录页面点击qq登录按钮时，需要记录回调页面，登录成功根据回调地址进行跳转，回调成功之后，记录的地址没有意义了，删除
const loginSuccess = (res: { data: User }) => {
  store.setUser(res.data)
  router.replace(store.returnUrl || '/home')
  store.updateReturnUrl('')
  showSuccessToast('登录成功')
}

// 用户手机号未和QQ账号绑定，调用接口，进行绑定
// 登录--绑定用户新-三方登录绑定手机号
const bind = async () => {
  const res = await bindMobileAPI({
    mobile: mobile.value,
    code: code.value,
    openId: openId.value
  })
  loginSuccess(res)
}

// 通过QQ的js文件(SDK)提供的API获取登录后的openId(就是后台需要的参数)，后台会根据这个id进行判断，判断用户是否关联过
// 如果后台的数据库中存储了openId + 你的手机号，去登录就可以成功，否则失败
onMounted(() => {
  // 检查QQ是否已经登录。QC作为一个全局变量，可以认为是window下的。
  if (window.QC.Login.check()) {
    // 获取openId，qq登录成功后返回的openId
    window.QC.Login.getMe(id => {
      openId.value = id
      // 此接口是用来判断用户的手机号是否已经绑定了QQ账号，如果绑定过会返回用户信息
      // 登录--三方登录--qq三方登录
      loginByQQAPI(id)
        .then(res => {
          // 用户QQ已经和手机号绑定了
          loginSuccess(res)
        })
        .catch(() => {
          // 用户QQ未和手机号绑定，没有绑定，用户需要看到这个页面
          isBind.value = true
        })
    })
  }
})

// HOOk - 验证码
const form = ref<FormInstance>()
const { time, send } = useMobileCode(mobile, 'bindMobile', form.value)
</script>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>
