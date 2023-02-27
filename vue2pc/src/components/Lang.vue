<template>
  <el-dropdown @command="changeLanguage">
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <!-- $i18n是Vue.use(VueI18n)添加给Vue原型的全局属性，通过它可以拿到i8n里local环境的标识 -->
      <el-dropdown-item :disabled="this.$i18n.locale === 'zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="this.$i18n.locale === 'en'" command="en">英文</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'Lang',
  methods: {
    changeLanguage(lang) {
      Cookies.set('language', lang) // 切换多语言
      this.$i18n.locale = lang // 设置给本地的i18n插件
      this.$message.success('切换多语言成功')
    }
  }
}
</script>
