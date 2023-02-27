import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
// 打包svg图标
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// 按需加载vant组件
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
// 动态修改html里的内容需要引入插件
import { createHtmlPlugin } from 'vite-plugin-html'
// mock
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  server: {
    port: 80,
    host: true,
    open: true
  },
  plugins: [
    createHtmlPlugin(), // 动态修改html里的内容需要引入插件
    // mock
    viteMockServe({
      mockPath: './src/mock', // mock时，扫描的文件
      localEnabled: true // 开发环境开不开启mock
    }),
    vue({ reactivityTransform: true }),
    // 按需加载vant组件。默认自动加载components下的通用级别组件
    Components({
      dts: false, // 默认是true开启自动生成组件的类型声明文件，vant的组件已经有类型声明文件，不需要
      // Toast Confirm这类函数式组件的样式需要单独引入，样式在mian中全局引入了，关闭自动引入样式
      resolvers: [VantResolver({ importStyle: false })]
    }),
    // 打包svg图标
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
