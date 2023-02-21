<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <!-- 左侧 -->
      <el-col>
        <div v-if="showBefore" class="before">
          <i class="el-icon-info" />
          <slot name="before" />
        </div>
      </el-col>

      <!-- 右侧 -->
      <el-col>
        <el-row type="flex" justify="end">
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
// 组件可以显示左侧内容，也可以显示右侧内容，如果左侧内容不传，图标应该不显示
export default {
  name: 'PageTools',
  props: {
    showBefore: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style lang='scss'>
.page-tools {
  margin: 10px 0;

  .before {
    line-height: 34px;

    i {
      margin-right: 5px;
      color: #409eff;
    }

    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}
</style>
