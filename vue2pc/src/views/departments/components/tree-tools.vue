<template>
  <!-- tree节点的宽度，默认由内容撑开，所以加了width:100%; -->
  <el-row type="flex" align="middle" style="height: 40px; width: 100%;">
    <el-col :span="20">
      <span>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <!-- 两个内容 -->
        <el-col :span="12">{{ nodeData.manager }}</el-col>
        <el-col :span="12">
          <!-- 下拉菜单 -->
          <el-dropdown trigger="click" @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单项 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edi">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'

export default {
  name: 'TreeTools',
  props: {
    // 此页面根据父组件传递过来的nodeData数据，进行渲染
    nodeData: { type: Object, require: true, default: () => ({}) },
    isRoot: { type: Boolean, default: false }
  },
  methods: {
    handleCommand(command) {
      // 添加子部门，需要记录父的id（this.nodeData）
      if (command === 'add') {
        this.$emit('addDepts', this.nodeData)
      }

      // 删除
      if (command === 'del') {
        this.$confirm('是否继续', '提示').then(async() => {
          try {
            await delDepartments(this.nodeData.id) // API：根据id删除部门
            this.$emit('delUpdate') // 重新拉取数据
          } catch (error) { }
        }).catch(() => { })
      }

      // 编辑
      if (command === 'edi') {
        // this.nodeData编辑的哪一个数据
        this.$emit('ediDepts', this.nodeData)
      }
    }
  }
}
</script>
