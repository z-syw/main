<template>
  <div class="login-page">
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ !isPass ? '密码登录' : '短信验证码登录' }}</span>
        <van-icon name="arrow" />
      </a>
    </div>

    <van-form autocomplete="off" @submit="login" ref="form">
      <van-field name="mobile" placeholder="请输入手机号" :rules="mobileRules" v-model="mobile" type="tel" />

      <van-field
        v-if="isPass"
        placeholder="请输入密码"
        :rules="passwordRules"
        v-model="password"
        :type="show ? 'text' : 'password'"
      >
        <template #button>
          <cp-icon :name="`login-eye-${show ? 'on' : 'off'}`" @click="show = !show" />
        </template>
      </van-field>

      <van-field v-else v-model="code" placeholder="短信验证码" :rules="codeRules">
        <template #button>
          <span class="btn-send" @click="send" :class="{ active: time > 0 }">
            {{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}
          </span>
        </template>
      </van-field>

      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>

      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>

    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <a
        class="icon"
        @click="store.updateReturnUrl($route.query.returnUrl as string)"
        :href="`https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=${url}`"
      >
        <img src="@/assets/qq.svg" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { showToast, type FormInstance } from 'vant'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { loginByPasswordAPI, loginByMobileAPI } from '@/services/user'
import { useRoute, useRouter } from 'vue-router'
import { useMobileCode } from '@/composable'

const store = useUserStore()
const router = useRouter()
const route = useRoute()

const url = encodeURIComponent(import.meta.env.VITE_APP_CALLBACK)

// 小眼睛
const show = ref(false)
// 控制显示验证码/密码登录
const isPass = ref(true)
// 表单数据
const mobile = ref('13230000100')
const password = ref('abc12345')
const agree = ref(false)
const code = ref('')

// 当表单校验通过后触发submit事件，触发此函数
const login = async () => {
  if (!agree.value) return showToast('请阅读用户协议，并勾选')
  try {
    const res = isPass.value
      ? await loginByPasswordAPI(mobile.value, password.value)
      : await loginByMobileAPI(mobile.value, code.value)
    store.setUser(res.data)
    router.replace((route.query.returnUrl as string) || '/home')
    showToast('登录成功')
  } catch (error) {}
}

// HOOk - 验证码
const form = ref<FormInstance>()
const { time, send } = useMobileCode(mobile, 'login', form.value)
</script>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>
