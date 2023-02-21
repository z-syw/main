<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="cancel" @open="handleOpen">
    <!-- 复选框是通过label收集选中的值，label绑定的就是提交给后台的id -->
    <template v-if="(list && roleIds)">
      <el-checkbox-group v-model="roleIds" v-loading="loading">
        <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
    </template>

    <template #footer>
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button size="small" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { assignRoles } from '@/api/employees'
import { getUserDetailById } from '@/api/user'

export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: { type: Boolean, default: false },
    userId: { type: String, default: null }
  },
  data() {
    return {
      list: [],
      roleIds: [],
      loading: false
    }
  },

  methods: {
    handleOpen() {
      this.loading = true
      // async函数，默认就相当于进行了一层promise包裹，async函数执行的结果，本身就是一个promise对象
      Promise.all([this.getRoleList(), this.getUserDetailById()]).then(() => {
        this.loading = false
      })
    },

    // API：获取所有的角色
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 10 })
      this.list = rows
    },

    // API：根据用户id获取用户的详情
    async getUserDetailById() {
      const { roleIds } = await getUserDetailById(this.userId)
      this.roleIds = roleIds
    },

    // API：给用户分配角色
    async confirm() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.cancel()
    },

    // 关闭对话框
    cancel() {
      this.$emit('update:showRoleDialog', false) // 关闭对话框
      this.roleIds = [] // 清空数据
    }
  }
}
</script>
