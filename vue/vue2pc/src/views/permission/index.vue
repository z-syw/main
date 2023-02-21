<template>
  <div class="permission-container">
    <div class="app-container">
      <el-card>
        <el-button type="primary" size="small" @click="add(1, '0')">添加权限</el-button>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column align="center" label="标识" prop="code" />
          <el-table-column align="center" label="描述" prop="description" />
          <el-table-column align="center" label="操作">
            <template #default="{ row }">
              <!-- 渲染的是一级，想通过一级的添加按钮，往下面加二级，二级的pid等于一级的id -->
              <el-button v-if="row.type === 1" type="text" @click="add(2, row.id)">添加权限</el-button>
              <el-button type="text" @click="edit(row.id)">编辑</el-button>
              <el-button type="text" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 新增编辑的弹层 -->
      <el-dialog :visible="showDialog" :title="showText" @close="cancel">
        <el-form ref="permForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" style="width:90%" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button size="small" @click="confirm">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { tranListToTreeData } from '@/utils'
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permission'

export default {
  name: 'Permission',
  data() {
    const validateName = (rule, value, callback) => {
      // 添加
      let nameList = this.newList.filter(item => item.pid === this.formData.pid).map(item => item.name)
      // 编辑
      if (this.formData.id) {
        nameList = this.newList.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).map(item => item.name)
      }
      nameList.includes(value) ? callback(new Error(`${value}名字已经存在`)) : callback()
    }

    const validateCode = (rule, value, callback) => {
      // 添加
      let codeList = this.newList.map(item => item.code)
      // 编辑
      if (this.formData.id) {
        codeList = this.newList.filter(item => item.id !== this.formData.id).map(item => item.code)
      }
      codeList.includes(value) ? callback(new Error(`${value}名字已经存在`)) : callback()
    }

    return {
      list: [],
      newList: [],
      showDialog: false,
      formData: {
        name: '', // 权限名称
        code: '', // 权限标识
        description: '', // 权限描述
        type: '', // 权限类型
        pid: '', // 添加到哪个节点下
        enVisible: '0' // 0禁用，1启用
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    showText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },

  created() {
    this.getPermissionList() // // API：获取所有权限点
  },

  methods: {
    // API：获取所有权限点
    async getPermissionList() {
      const res = await getPermissionList()
      this.newList = res
      this.list = tranListToTreeData(res, '0')
    },

    // 新增权限
    add(type, pid) {
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },

    // 取消
    cancel() {
      this.formData = {}
      this.$refs.permForm.resetFields()
      this.showDialog = false
    },

    // 确定
    confirm() {
      this.$refs.permForm.validate().then(async() => {
        if (this.formData.id) {
          // 编辑
          await updatePermission(this.formData)
          this.getPermissionList() // 重新渲染
          this.$message.success('操作成功')
          this.cancel() // 关闭弹窗
        } else {
          // 新增
          await addPermission(this.formData)
          this.getPermissionList() // 数据回显
          this.$message.success('操作成功')
          this.cancel() // 关闭弹窗
        }
      }).catch(() => { })
    },

    // 编辑
    async edit(id) {
      this.formData = await getPermissionDetail(id) // 数据回显
      this.showDialog = true
    },

    // 删除
    del(id) {
      this.$confirm('确认删除该权限点吗').then(async() => {
        await delPermission(id)
        this.getPermissionList() // 数据回显
        this.$message.success('删除成功')
      }).catch(() => { })
    }
  }
}
</script>
