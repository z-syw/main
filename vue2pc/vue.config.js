'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template'
const port = process.env.port || process.env.npm_config_port || 9528

let cdn = { css: [], js: [] }
let externals = {}
// 判断是否是生产环境，只有生产环境才有必要去做排除和注入CDN
const isProd = process.env.NODE_ENV === 'production'
if (isProd) {
  externals = {
    vue: 'Vue',
    'element-ui': 'ELEMENT',
    xlsx: 'XLSX'
  }
  // 配置第三方资源的CDN，注意先后顺序
  cdn = {
    css: ['https://unpkg.com/element-ui/lib/theme-chalk/index.css'],
    js: [
      'https://unpkg.com/vue@2.6.10/dist/vue.js',
      'https://unpkg.com/element-ui/lib/index.js',
      'https://cdn.jsdelivr.net/npm/xlsx@0.16.8/dist/xlsx.min.js'
    ]
  }
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // 前端发请求到后端，接口存在跨域问题，后端没有开启cors也不支持jsonp，所以在webpack开发服务器配置反向代理，做代理转发
    // webpack开发服务器默认支持代理转发的功能，但是需要在vue.config.js中配置
    // 配置完成之后，axios发请求，请求的就是本地开发服务器地址
    // 本地开发服务器地址再去请求后端服务器
    proxy: {
      // 可以配置多个
      // "/test": {},

      // 当地址中有/api的时候会触发代理机制
      // 请求自己：http://localhost:8080/api/login
      // 将被代理到：http://ihrm.itheima.net/api/login

      // 问题：有时候不需要路径中的/api，怎么办？可以将最终请求路径中的标识去掉
      // 请求自己：http://localhost:8080/api/login
      // 将被代理到：http://ihrm.itheima.net/login
      '/api': {
        // target: 'http://ihrm-java.itheima.net', // 后端接口服务器
        target: 'http://ihrm.itheima.net', // 后端接口服务器
        changeOrigin: true // 改变请求来源(欺骗后端你的请求是http://ihrm-java.itheima.net/)
        // pathRewrite: { '^/api': '' }
      }
    }
  },

  configureWebpack: {
    name: name,
    // @目录指代src
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals: externals
  },
  chainWebpack(config) {
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // webpack打包的时候，将CDN注入到index.html中
    config.plugin('html').tap(args => {
      args[0].cdn = cdn
      return args
    })

    config.plugins.delete('prefetch')
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()

    // svg的loader
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      .end()

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{ inline: /runtime\..*\.js$/ }])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
