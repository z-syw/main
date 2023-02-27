// 原生svg使用过于麻烦，为了方便使用，将svg封装成组件
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'
Vue.component('svg-icon', SvgIcon)

// 以下代码的含义就是将svg目录下的所有的.svg后缀的文件全都导入到项目中
// require.context() 参数一：要查找的目录；参数二：是否查找子目录；参数三：要匹配文件的正则
const req = require.context('./svg', false, /\.svg$/)
const requireAll = req => req.keys().map(req)
requireAll(req)
// 通过以上代码，已经把svg全部导入到了项目中，然后在配合webpack插件svg-sprites-loader
// 此插件会自动加载导入的svg图标，放到symbol元素中，生成svg精灵图
