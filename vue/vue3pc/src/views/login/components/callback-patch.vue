<template>
  <Form ref="target" class="xtx-form" :validation-schema="mySchema" v-slot="{ errors }" autocomplete="off">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{ err: errors.account }" name="account" v-model="form.account" class="input" type="text"
          placeholder="请输入用户名" />
      </div>
      <div class="error" v-if="errors.account">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{ err: errors.mobile }" v-model="form.mobile" name="mobile" class="input" type="text"
          placeholder="请输入手机号" />
      </div>
      <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{ err: errors.code }" v-model="form.code" name="code" class="input" type="text"
          placeholder="请输入验证码" />
        <span class="code" @click="send">{{ timer === 0 ? '发送验证码' : `${timer}秒后发送` }}</span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{ err: errors.password }" v-model="form.password" name="password" class="input" type="password"
          placeholder="请输入密码" />
      </div>
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{ err: errors.rePassword }" v-model="form.rePassword" name="rePassword" class="input"
          type="password" placeholder="请确认密码" />
      </div>
      <div class="error" v-if="errors.rePassword">{{ errors.rePassword }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即注册</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import Message from '@/components/library/Message'
import schema from '@/utils/vee-validate-schema'
import { reactive, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'CallbackPatch',
  props: { unionId: { type: String, default: '' } },
  components: { Form, Field },
  setup(props) {
    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null,
      account: null, // xtxsyw
      password: null,
      rePassword: null
    })
    // 表单校验规则
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code,
      account: schema.accountAPI,
      password: schema.password,
      rePassword: schema.rePassword
    }

    const target = ref(null)
    const timer = ref(0) // 定时器秒数
    // pause：销毁定时器；resume：开启定时器；1000多长时间执行一次；false不立即开启定时器
    const { pause, resume } = useIntervalFn(() => {
      timer.value-- // 每隔一秒钟减减
      if (timer.value <= 0) pause() // 如果秒数小于等于0，销毁定时器
    }, 1000, false)

    // 发送验证码
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      // 校验成功
      if (valid === true) {
        // 没有倒计时才可以发送验证码
        if (timer.value === 0) {
          try {
            await userQQPatchCode(form.mobile)
            Message({ type: 'success', text: '发送成功' })
            timer.value = 60 // 定时器秒数60s
            resume() // 开启定时器
          } catch (error) {
            if (error) {
              Message({ type: 'error', text: error.response.data.message })
            }
          }
        }
      } else {
        // 校验失败，使用vee的错误函数setFieldError('字段名', 错误信息)显示错误信息
        target.value.setFieldError('mobile', valid)
      }
    }
    // 当组件销毁时，清除定时器
    onUnmounted(() => { pause() })

    // 立即提交
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const submit = async () => {
      const valid = target.value.validate()
      if (valid) {
        try {
          const data = await userQQPatchLogin({ unionId: props.unionId, ...form })
          store.commit('user/setUser', data.result) // 存储用户信息
          // 合并购物车操作
          store.dispatch('cart/mergeLocalCart').then(() => {
            Message({ type: 'success', text: '完善信息成功' })
            router.push(route.query.redirectUrl || '/')
          })
        } catch (error) {
          if (error) {
            Message({ type: 'error', text: error.response.data.message })
          }
        }
      }
    }

    return { form, mySchema, send, target, timer, submit }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;

  &:hover {
    cursor: pointer;
  }
}
</style>
