<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i>
        使用用户名密码登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i>
        使用手机号验证码登录
      </a>
    </div>

    <!-- Form 添加 v-slot="{errors}" 使用作用域插槽暴露errors错误对象 -->
    <Form ref="target" class="form" :validation-schema="mySchema" v-slot="{ errors }" autocomplete="off">
      <!-- 使用用户名密码登录 -->
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <!-- Field添加name属性，作用是指定使用schema中哪个校验规则 -->
            <Field name="account" v-model="form.account" :class="{ error: errors.account }" type="text"
              placeholder="请输入用户名" />
          </div>
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{ errors.account }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field name="password" v-model="form.password" :class="{ error: errors.password }" type="password"
              placeholder="请输入密码" />
          </div>
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{ errors.password }}</div>
        </div>
      </template>
      <!-- 使用手机号验证码登录 -->
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field name="mobile" v-model="form.mobile" :class="{ error: errors.mobile }" type="text"
              placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field name="code" v-model="form.code" :class="{ error: errors.code }" type="text" placeholder="请输入验证码" />
            <span class="code" @click="send">{{ timer === 0 ? '发送验证码' : `${timer}秒后发送` }}</span>
          </div>
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{ errors.code }}</div>
        </div>
      </template>

      <!-- 我同意该协议 -->
      <div class="form-item">
        <div class="agree">
          <!-- Field的as属性可以指定为其他标签，也可指定为组件，但是组件需要支持v-model否则校验不会触发 -->
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;"> 隐私条款 </a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{ errors.isAgree }}</div>
      </div>
      <!-- 登录按钮 -->
      <a href="javascript:;" class="btn" @click="login">登录</a>
    </Form>

    <!-- QQ登录 -->
    <div class="action">
      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" />
      </a>
      <!-- 忘记密码 免费注册 -->
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import schema from '@/utils/vee-validate-schema'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
import { onUnmounted, reactive, ref, watch } from 'vue'
import Message from '@/components/library/Message'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup() {
    // 控制显示'使用用户名密码登录'和'使用手机号验证码登录'
    const isMsgLogin = ref(false)
    // 表单数据对象
    const form = reactive({
      // 使用用户名密码登录
      account: null, // 用户名zhousg
      password: null, // 密码123456
      // 使用手机号验证码登录
      mobile: null, // 手机号13241051259
      code: null, // 验证码123456
      isAgree: true // 默认勾选我同意
    })
    // 校验规则函数
    // const mySchema = {
    //   // 校验规则：返回true就是校验成功；返回字符串就是校验失败，字符串就是错误提示
    //   // account默认传入value，value就是表单里的值
    //   account(value) {
    //     if (!value) return '请输入用户名'
    //     return true
    //   }
    // }
    const mySchema = {
      code: schema.code,
      mobile: schema.mobile,
      account: schema.account,
      password: schema.password,
      isAgree: schema.isAgree
    }

    // 在切换短信与账户登录时清空表单和校验结果
    // 只要isMsgLogin变化，就证明用户切换了
    const target = ref(null)
    watch(isMsgLogin, () => {
      form.isAgree = true
      form.account = null
      form.mobile = null
      form.code = null
      form.password = null
      // 如果标签中使用的是v-show，就必须使用Form组件提供的resetForm()方法，手动清除校验结果
      target.value.resetForm()
    })

    // 点击登录时对表单整体校验；Form组件提供了一个validate函数作为整体表单校验，返回Promise
    // const login = () => { target.value.validate().then(valid => { }) }
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const login = async () => {
      const valid = await target.value.validate()
      if (valid) {
        try {
          let data = null
          if (isMsgLogin.value) {
            // 手机号验证码登录
            data = await userMobileLogin({ mobile: form.mobile, code: form.code })
          } else {
            // 用户名密码登录
            data = await userAccountLogin({ account: form.account, password: form.password })
          }
          store.commit('user/setUser', data.result) // 存储用户信息
          // 合并购物车操作
          store.dispatch('cart/mergeLocalCart').then(() => {
            Message({ type: 'success', text: '登录成功' })
            router.push(route.query.redirectUrl || '/')
          })
        } catch (e) {
          if (e.response.data) {
            Message({ type: 'error', text: e.response.data.message || '登录失败' })
          }
        }
      }
    }

    const timer = ref(0) // 定时器秒数
    // pause：销毁定时器；resume：开启定时器；1000多长时间执行一次；false不立即开启定时器
    const { pause, resume } = useIntervalFn(() => {
      timer.value-- // 每隔一秒钟减减
      if (timer.value <= 0) pause() // 如果秒数小于等于0，销毁定时器
    }, 1000, false)

    // 发送验证码，需要校验手机号和判断是否60秒内，方可发送
    const send = async () => {
      // 使用schma函数来校验mobile，如果成功继续执行，不成功使用Form组件错误setFieldError
      const valid = mySchema.mobile(form.mobile)
      // 校验成功
      if (valid === true) {
        // 没有倒计时才可以发送验证码
        if (timer.value === 0) {
          try {
            await userMobileLoginMsg({ mobile: form.mobile })
            Message({ type: 'success', text: '发送成功' })
            timer.value = 60 // 定时器秒数60s
            resume() // 开启定时器
          } catch (error) {
            if (error) {
              Message({ type: 'error', text: error.response.data.message || '发送失败' })
            }
          }
        }
      } else {
        // 校验失败，使用vee的错误函数setFieldError('字段名', 错误信息)显示错误信息
        target.value.setFieldError('mobile', valid)
      }
    }
    onUnmounted(() => { pause() }) // 组件销毁时，清除定时器

    return { isMsgLogin, form, mySchema, target, timer, login, send }
  }
}
</script>

<style scoped lang="less">
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: @xtxColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 40px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        >i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: @priceColor;
          }

          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
