// __filename当前文件的完整路径
// __dirname当前文件夹的绝对路径
// path.join()用来将多个路径片段拼接成一个完整的路径字符串
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
    // 设置外部扩展，模块名为qc，变量名为QC，页面中使用import导入时，qc将不会被webpack打包，前提是在index.html导入此文件
    externals: { qc: 'QC' },
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
  }
})
