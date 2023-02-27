<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card v-loading="loading">
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height: 45px">
              <el-button icon="el-icon-plus" type="primary" size="small" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <el-table border :data="list">
              <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="80" />
              <el-table-column align="center" prop="name" label="角色名称" width="200" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template #default="{ row }">
                  <el-button size="small" type="text" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="text" @click="deleteRole(row.id)">删除</el-button>
                  <el-button size="small" type="text" @click="assignPerm(row.id)">分配权限</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                :current-page="page.page"
                :page-sizes="[1, 2, 3, 4, 5]"
                :page-size="page.pagesize"
                :total="page.total"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="changePage"
                @size-change="sizeChange"
              />
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="公司信息">
            <el-alert
              type="info"
              :show-icon="true"
              :closable="false"
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="2" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 编辑、删除弹层 -->
    <el-dialog :title="title" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </template>
    </el-dialog>

    <!-- 分配权限弹层 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'

export default {
  data() {
    return {
      list: [], // 表格数据
      loading: false,
      page: {
        page: 1, // 当前页面
        pagesize: 5, // 页面显示的条数
        total: 0 // 总数，分页使用
      },
      formData: {}, // 公司信息
      showDialog: false,
      roleForm: { name: '', description: '' },
      rules: { name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }] },
      defaultProps: { label: 'name' },
      // 分配权限弹层
      showPermDialog: false,
      selectCheck: [],
      permData: [],
      roleId: null
    }
  },

  computed: {
    title() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoleList() // API：获取所有角色列表
    this.getCompanyInfo() // API：公司信息
  },

  methods: {
    // API：获取所有角色列表
    async getRoleList() {
      this.loading = true
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },

    // 点击分页切换下一页
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList() // API：获取所有角色列表
    },

    // 每页条数的变化
    sizeChange(val) {
      this.page.pagesize = val
      this.page.page = 1 // 重置到第一页
      this.getRoleList() // API：获取所有角色列表
    },

    // 序号
    indexMethod(index) {
      // 当前页的序号 + 前面一共有多少条
      // 前面一共有多少条 = 前面有多少页 * 每页条数
      return (this.page.page - 1) * this.page.pagesize + (index + 1)
    },

    // API：根据id删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        await deleteRole(id)
        // bug：假定数据有两页，点击第二页时，page为2，删除最后一页最后一条数据时，发现表格里暂无数据
        // 因为删除时重新请求了数据，但是此时请求的是第二页的数据，第二页没有了数据，所以会出现暂无数据
        if (this.list.length === 1) this.page.page--
        // 假如后台要求传递的page最小只能是1，那我就强制改成1
        if (this.page.page === 0) this.page.page = 1
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) { }
    },

    // 编辑、新增的取消按钮
    btnCancel() {
      this.showDialog = false // 关闭弹层
      this.roleForm = { name: '', description: '' }
      this.$refs.roleForm.resetFields()// 移除校验，不完全重置
    },

    // API：根据id获取角色详情
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 数据回写
      this.showDialog = true // 显示弹层
    },

    // 编辑、新增的确定按钮
    async btnOK() {
      try {
        await this.$refs.roleForm.validate() // 表单兜底校验
        // roleForm这个对象有id就是编辑，没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm) // API：编辑角色
        } else {
          await addRole(this.roleForm) // API：新增角色
        }
        this.getRoleList()// 重新拉取数据
        this.$message.success('操作成功')
        this.showDialog = false // 关闭弹层，触发el-dialog的close事件
      } catch (error) { }
    },

    // 根据id查询企业
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.companyId)
    },

    // 点击分配权限按钮，显示弹层，获取数据，同时需要做数据回显
    async assignPerm(id) {
      this.roleId = id // 点击确定时需要id，记录下
      this.permData = tranListToTreeData(await getPermissionList(), '0') // 获取所有权限
      // tree组件做数据回显
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.showPermDialog = true // 显示弹层
    },
    // 点击分配权限弹层确认按钮，提交数据，关闭弹层
    async btnPermOK() {
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(), // tree组件提供的方法
        id: this.roleId
      })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    // 点击分配权限弹层取消按钮，重置数据，关闭弹层
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>
