<template>
  <el-dialog :title="title" :visible="visible" @close="closeDialog">
    <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          <!-- label是给用户看的，value是收集给后台的 -->
          <el-option v-for="item in userList" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'

export default {
  name: 'AddDept',
  props: {
    visible: { type: Boolean, default: false },
    nodeData: { type: Object, require: true, default: () => ({}) }, // 新增或者编辑时传递过来的数据
    deptList: { type: Array, require: true, default: () => [] } // 没有经过处理的原生树形数据
  },
  data() {
    // 部门名称校验
    const validatorName = (rules, value, callback) => {
      let arr = []
      if (this.form.id) {
        // 编辑时的部门名称校验
        if (this.nodeData.name === value) {
          callback()
          return
        }
        arr = this.deptList.filter(item => item.pid === this.nodeData.pid)
      } else {
        // 根据父的id找所有兄弟
        arr = this.deptList.filter(item => item.pid === this.nodeData.id)
      }
      // 只要value和arr中任意一个部门的name相等，就不通过校验
      const isRepeat = arr.some(item => item.name === value)
      if (isRepeat) callback(new Error('重复的部门'))
      callback()
    }

    // 要求：检查编码是否在整个部门列表中重复
    const validatorCode = (rules, value, callback) => {
      if (this.form.id && value === this.nodeData.code) {
        // 编辑情况下，code可以和原来的一样，通过校验
        callback()
        return
      }
      const isRepeat = this.deptList.some(item => item.code === value)
      if (isRepeat) callback(new Error('重复的编码'))
      callback()
    }

    return {
      userList: [], // API：获取员工简单列表
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validatorName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validatorCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },

  computed: {
    title() {
      return this.form.id ? '编辑部门' : '添加子部门'
    }
  },

  created() {
    this.getEmployeeSimple()
  },

  methods: {
    // API：获取员工简单列表
    async getEmployeeSimple() {
      this.userList = await getEmployeeSimple()
    },

    // API：根据id查询部门详情，用来做数据回填
    async getDepartDetail() {
      this.form = await getDepartDetail(this.nodeData.id)
    },

    // 关闭对话框
    closeDialog() {
      this.$emit('update:visible', false) // 关闭对话框，.sync语法糖
      // bug：resetFields清空重置，只能清空重置绑定在表单中的值
      this.$refs.deptForm.resetFields() // 重置表单
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },

    // 确定
    confirm() {
      // 表单整体校验
      this.$refs.deptForm.validate(async flag => {
        if (flag) {
          if (this.form.id) {
            // 编辑
            await updateDepartments(this.form)
            this.$message.success('更新成功')
          } else {
            // 新增
            // 校验通过，发请求携带参数，API：新增部门，参数要求其中之一：pid：父级部门id
            await addDepartments({ ...this.form, pid: this.nodeData.id })
            this.$message.success('添加成功')
          }
          this.$emit('addUpdate') // 重新拉取数据
          this.$emit('update:visible', false) // 关闭对话框，.sync语法糖
        }
      })
    }
  }
}
</script>
