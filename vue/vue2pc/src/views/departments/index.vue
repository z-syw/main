<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="loading" class="tree-card">
        <!-- 头部 -->
        <treeTools :node-data="company" :is-root="true" />

        <!-- 底部 -->
        <el-tree :data="departs" :props="defaultProps">
          <template #default="{ data }">
            <treeTools :node-data="data" @delUpdate="getDepartments" @addDepts="addDepts" @ediDepts="ediDepts" />
          </template>
        </el-tree>
      </el-card>

      <!--
        .sync修饰符：
        子组件不能更新父组件传递的props数据，但是加上了.sync，子组件通过this.$emit('update:visible', 值)就可以更改
      -->
      <addDept
        ref="addDept"
        :node-data="nodeData"
        :dept-list="deptList"
        :visible.sync="visible"
        @addUpdate="getDepartments"
      />
    </div>
  </div>
</template>

<script>
import addDept from './components/add-dept.vue'
import treeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { transListToTree } from '@/utils'

export default {
  name: 'Departments',
  components: { treeTools, addDept },
  data() {
    return {
      company: { name: '去大西洋学前端', manager: '宇宙无敌帅' },
      departs: [],
      deptList: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      visible: false,
      nodeData: {},
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },

  methods: {
    // 获取组织架构列表数据
    async getDepartments() {
      this.loading = true
      const { depts } = await getDepartments()
      this.deptList = depts
      this.company.id = '' // 公司id比较特殊，需要单独记下来
      const treeData = transListToTree(depts, '')
      this.departs = treeData
      this.loading = false
    },

    // 添加子部门
    addDepts(nodeData) {
      this.nodeData = nodeData // 记录点击添加子部门需要的父id
      this.visible = true // 弹窗打开
    },

    // 编辑部门
    ediDepts(nodeData) {
      this.nodeData = nodeData // 记录需要编辑的哪个部门的id
      this.visible = true // 弹窗打开
      this.$nextTick(() => {
        this.$refs.addDept.getDepartDetail() // 数据回显
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-tree {
  ::v-deep {

    // 小三角的样式, 去掉默认的小三角的旋转效果
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    // 有子节点且未展开 +
    .el-icon-caret-right:before {
      background: url("~@/assets/common/add-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }

    // 有子节点且已展开 -
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
      background: url("~@/assets/common/minus-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }

    // 没有子节点
    .el-tree-node__expand-icon.is-leaf::before {
      background: url("~@/assets/common/user-filling.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
  }
}
</style>
