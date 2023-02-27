<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
      label-position="left">

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.mobile" placeholder="请输入手机号" type="text" tabindex="1" auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
          placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button class="loginBtn" :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
export default {
  name: 'Login',
  data() {
    const validateMobile = (rule, value, callback) => {
      validMobile(value) ? callback() : callback(new Error('手机号格式不正确'))
    }

    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        // trigger校验的触发方式只有两个选项blur/change
        mobile: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { trigger: 'blur', min: 6, max: 16, message: '密码长度为6-16位之间' }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },

  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },

  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    handleLogin() {
      this.$refs.loginForm.validate(async isOK => {
        if (isOK) {
          try {
            this.loading = true
            // 这里需要异步操作
            await this.$store.dispatch('user/login', this.loginForm)
            this.$message.success('登录成功')
            // 怎么拿到退出登录时（主动和被动），回传的登录未遂的地址
            // this.$route.query，vue-router内会把？后面参数字符串转成对象，挂在query属性上
            // 前面有地址就跳转回登录未遂地址，没有证明就是第一次登录，就用后面的地址，跳转到首页
            // decodeURIComponent(this.$route.query.redirect) 编码解码这里用不用都行
            this.$router.replace(this.$route.query.redirect || '/')
          } catch (error) {
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
// 设置手机号和密码的字体颜色，将输入框颜色改成蓝色
$light_gray: #68b0fe;
// 输入框光标颜色
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login-container {
  background-color: #2d3a4b;

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  // 设置输入表单整体背景色
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
    color: #454545;

    input {
      color: #fff;
    }
  }

  // 设置错误信息的颜色
  .el-form-item__error {
    color: #fff
  }

  // 设置登录按钮的样式
  .loginBtn {
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
