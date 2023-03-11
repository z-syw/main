const path = require('path')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 本地网站访问的是http://localhost:8080，在QQ互联配置的回调地址是http://www.xxxx.com:8080，俩个地址不一致无法进行跳转
    // 需要我们修改本地的hosts文件，让域名访问时解析到我们本地的ip上
    allowedHosts: ['www.corho.com']
  },
  // webpack的配置
  configureWebpack: {
    externals: {
      qc: 'QC'
    },
    plugins: [require('unplugin-vue-define-options/webpack')()]
  },
  pluginOptions: {
    // 自动注入less公用变量和混入
    'style-resources-loader': {
      preProcessor: 'less',
      // 哪些Less文件自动引入，使用绝对路径，自动引入后可以直接使用类名
      patterns: [
        path.join(__dirname, './src/assets/styles/mixins.less'),
        path.join(__dirname, './src/assets/styles/variables.less')
      ]
    }
  },
  publicPath: '/'
})
