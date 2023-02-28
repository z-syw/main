<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        // 如果icon是以el-icon开头，说明是element-ui的图标
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        // 说明是自己的svg图标
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }

    // 这里的title就是路由表meta里的title
    // 我在这里做了多语言，但是多语言的key都是英文，而title都是中文，不好取出来数据
    // 所以我又在SiderbarItem里修改了传入过来的值，把title改成了name
    // 因此现在这里的title对应路由表里的name
    // vnodes.push(<span slot='title'>{(that.$t(`siderbar.${title.toLowerCase()}`))}</span>)

    // 如果传了title有文字
    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
