<template>
  <Form ref="target" class="xtx-form" :validation-schema="mySchema" autocomplete="off" v-slot="{ errors }">
    <div class="user-info">
      <img :src="avatar" />
      <p>{{ nickname }}</p>
    </div>

    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{ err: errors.mobile }" name="mobile" v-model="form.mobile" class="input" type="text"
          placeholder="绑定的手机号" />
      </div>
      <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>

    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{ err: errors.code }" name="code" v-model="form.code" class="input" type="text"
          placeholder="短信验证码" />
        <span class="code" @click="send">{{ timer === 0 ? '发送验证码' : `${timer}秒后发送` }}</span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { useStore } from 'vuex'
import { Form, Field } from 'vee-validate'
import { userQQBindCode, userQQLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { reactive, ref, onUnmounted } from 'vue'
import schema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'CallbackBind',
  props: { unionId: { type: String, default: '' } },
  components: { Form, Field },
  setup(props) {
    const nickname = ref(null)
    const avatar = ref(null)
    if (QC.Login.check()) {
      // 获取QQ资料
      QC.api('get_user_info').success(res => {
        nickname.value = res.data.nickname
        avatar.value = res.data.figureurl_1
      })
    }

    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 校验规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
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
            await userQQBindCode({ mobile: form.mobile })
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

    // 立即绑定
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const submit = async () => {
      const valid = target.value.validate()
      if (valid) {
        try {
          const data = await userQQLogin({ unionId: props.unionId, ...form })
          store.commit('user/setUser', data.result) // 存储用户信息
          // 合并购物车操作
          store.dispatch('cart/mergeLocalCart').then(() => {
            Message({ type: 'success', text: '绑定成功' })
            router.push(route.query.redirectUrl || '/')
          })
        } catch (error) {
          if (error) {
            Message({ type: 'error', text: error.response.data.message })
          }
        }
      }
    }

    return { nickname, avatar, form, mySchema, target, timer, send, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;

  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }

  p {
    padding-left: 10px;
  }
}

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
