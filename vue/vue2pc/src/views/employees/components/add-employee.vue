<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel" @click.native="handleDialogClick">
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width: 50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width: 50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width: 50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width: 50%" placeholder="请选择">
          <!-- label给用户看的，value绑定到v-model上，给后台 -->
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width: 50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!-- v-model="formData.departmentName" readonly -->
        <el-input
          :value="formData.departmentName" style="width: 50%" placeholder="请选择部门" @focus="getDepartments"
          @click.native.stop="handleClick"
        />
        <div v-if="showTree" class="tree-box">
          <el-scrollbar>
            <el-tree v-loading="loading" :data="treeData" :props="{ label: 'name' }" @node-click="selectNode" />
          </el-scrollbar>
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width: 50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button size="small" @click="btnCancel">取消</el-button>
      <el-button size="small" @click="btnOK">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'

export default {
  props: {
    showDialog: { type: Boolean, default: false }
  },
  data() {
    return {
      EmployeeEnum,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      treeData: [],
      showTree: false,
      loading: false
    }
  },

  methods: {
    // 聚焦时发请求；API：获取部门列表
    async getDepartments() {
      // this.showTree = true // 聚焦时在显示el-tree
      // this.loading = true // 发请求前再来个loading效果
      // const { depts } = await getDepartments()
      // this.treeData = tranListToTreeData(depts, '')
      // this.loading = false // 请求结束关闭loading
    },

    // 点击事件
    async handleClick() {
      this.showTree = !this.showTree
      if (this.showTree === false) return
      this.showTree = true // 聚焦时在显示el-tree
      this.loading = true // 发请求前再来个loading效果
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false // 请求结束关闭loading
    },

    // 冒泡事件
    handleDialogClick() {
      this.showTree = false
    },

    // tree树形控件的点击事件
    selectNode(node) {
      // 可供选择的是叶子节点，如果节点有children，不是叶子节点，进行的就是展开折叠操作
      if (node.children && node.children.length > 0) return
      this.formData.departmentName = node.name
      this.showTree = false
    },

    // 确定
    async btnOK() {
      try {
        await this.$refs.addEmployee.validate() // 兜底校验
        await addEmployee(this.formData) // API：调用新增员工接口
        this.btnCancel() // 关闭弹层
        this.$emit('addEmployees') // 重新渲染
        this.$message.success('添加成功')
      } catch (error) { }
    },

    // 关闭
    btnCancel() {
      this.$emit('update:showDialog', false)
      this.showTree = false
      this.$refs.addEmployee.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  position: absolute;
  width: 50%;
  height: 150px;
  min-height: 50px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  overflow: hidden;
  background-color: #fff;

  ::v-deep {
    .el-tree-node__content {
      height: auto;
    }

    // element的滚动条，没有在文档中显示
    .el-scrollbar {
      height: 100%;

      .el-scrollbar__wrap {
        // 横向溢出隐藏
        overflow-x: hidden;
      }
    }
  }
}
</style>
