// eslint-disable-next-line no-undef
module.exports = {
  plugins: {
    // postcss-px-to-viewport是一款PostCSS插件，用于将px单位转化为vw/vh单位
    'postcss-px-to-viewport-8-plugin': {
      // 设备宽度375计算vw的值
      viewportWidth: 375
    }
  }
}

// 移动适配
// 屏幕宽度不同，网页元素尺寸等比缩放

// 如何做到上述？px单位或者百分比布局可以实现吗？
// px单位是绝对单位；百分比布局特点是宽度自适应，高度固定，两者都不可以。

// 解决方案一：rem适配（rem是相对单位，相对html标签根字号）
// 1. 使用rem作为单位，动态设置不同屏幕下html标签根字号，就可以做到移动适配了

// 2. 如何动态设置不同屏幕下html标签跟根字号？html标签根字号设置多少合适？
// 媒体查询能够检测视口的宽度，设置不同的根字号；目前rem布局方案中，将网页等分成10份，html标签的字号为视口宽度的1/10。
// 但是移动端屏幕实在太多，自己手写html标签根字号太过麻烦，如何解决？
// 使用flexible.js，原理就是根据不同的视口宽度给网页中html根节点设置不同的font-size。

// 3. 但是写rem单位不舒服还要自己手动计算，麻烦，如何解决？
// 使用插件，自动把px转rem

// 4. 就算使用了插件转换成功了，但是我还是想知道自己该如何计算？
// 假定设计稿是375px。rem = px单位数值 / 基准根字号
// 1rem = 1HTML标签字号

// 5. 媒体查询写法
// 视口宽度320px，根字号为32px。
// @media (width: 320px) {
//   html {
//     font-size: 32px;
//   }
// }

// 解决方案二：vw/vh适配（相对单位，相对视口的尺寸）
// vw = px单位数值 / (1/100视口宽度)
// 假定设计稿是375px。
// div {
//   width: (68 / 3.75vw);
//   height: (39 / 3.75vw);
// }

// 两者区别：
// rem需要不断修改html文字大小，需要媒体查询，需要flexible.js
// vw/vh省去各种判断和修改
