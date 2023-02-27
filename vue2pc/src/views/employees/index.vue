<template>
  <div class="employees-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <!-- 头部左侧 -->
        <template v-slot:before>
          <span slot="before">共{{ page.total }}条记录</span>
        </template>
        <!-- 头部右侧 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import?type=user')">Excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">Excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 表格 -->
      <el-card v-loading="loading">
        <el-table :data="list">
          <el-table-column type="index" label="序号" :index="indexMethod" sortable width="80" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column width="120px" label="头像" align="center">
            <template #default="{ row }">
              <img
                v-imagerror="imgDefalut" :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" sortable :sort-method="worknumbersort" />
          <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" :formatter="formDate" />
          <el-table-column label="账户状态" prop="enableState">
            <template v-slot="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="280">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :current-page="page.page" :page-sizes="[5, 10, 15]" :page-size="page.size" :total="page.total"
            layout="total, sizes, prev, pager, next, jumper" @current-change="changePage" @size-change="sizeChange"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 二维码 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <!-- 新增员工组件 -->
    <AddEmployee :show-dialog.sync="showDialog" @addEmployees="getEmployeeList" />

    <!-- 分配角色组件 -->
    <AssignRole :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import imgDefalut from '@/assets/common/employees.webp'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import AssignRole from './components/assign-role'
import QrCode from 'qrcode'
import dayjs from 'dayjs'

export default {
  name: 'Employees',
  components: { AddEmployee, AssignRole },
  data() {
    return {
      list: [], // API：获取员工综合列表
      page: {
        page: 1, // 页码
        size: 10, // 每页条数
        total: 0
      },
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: null,
      imgDefalut
    }
  },

  created() {
    this.getEmployeeList() // API：获取员工综合列表
  },

  methods: {
    // API：获取员工综合列表
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },

    changePage(newPage) {
      // newPage是最新的页码
      this.page.page = newPage // 赋值最新页码
      this.getEmployeeList() // 重新拉取数据
    },

    // 每页条数变化
    sizeChange(value) {
      this.page.size = value
      this.page.page = 1 // 需要重置到第一页
      this.getEmployeeList() // 重新拉取数据
    },

    // 序号
    indexMethod(index) {
      return index + 1 + (this.page.page - 1) * this.page.size
    },

    // 二维码
    showQrCode(url) {
      if (url) {
        // url存在的情况下，才弹出层
        this.showCodeDialog = true
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 转化的二维码，是一个地址，会跳转到该地址，否则显示内容
        })
      } else this.$message.warning('该用户还未上传头像')
    },

    // 格式化聘用形式，组件提供的方法，组件不提供方法就使用插槽技术
    formatEmployment(row, column, cellValue, index) {
      // 常量抽离，将用于进行判断的标识，抽离到常量模块，将来直接导入使用，整个项目用一份常量
      // parseInt解决字符串和数字问题
      const obj = EmployeeEnum.hireType.find(item => item.id === parseInt(cellValue))
      return obj ? obj.value : '扫地僧'
    },

    // 格式化时间
    formDate(row) {
      return dayjs(row.timeOfEntry).format('YYYY-MM-DD')
    },

    // 删除
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除该员工?')
        await delEmployee(id)
        this.$message.success('删除员工成功')
        if (this.list.length === 1 && this.page.page > 1) this.page.page--
        this.getEmployeeList() // 重新拉取数据
      } catch (error) { }
    },

    // 工号排序，后台返回的是字符串，字符串排序会有问题，所以用方法手写一个
    worknumbersort(a, b) {
      return parseInt(a.workNumber) - parseInt(b.workNumber)
    },

    // 分配角色
    editRole(id) {
      this.userId = id
      this.showRoleDialog = true
    },

    // 导出Excel
    exportData() {
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        // 后台没有获取所有员工的接口，所以在前端这里手写，一页把所有数据获取过来
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatFn(headers, rows)
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头['姓名', '学号', '年纪']
          data: data, // excel的主体数据，固定格式规范，二维数组[['张三', '111', '18'], ['李四', '112', '19']]
          filename: '员工信息表',
          autoWidth: true, // 列宽是否自适应
          bookType: 'xlsx', // 生成文件的后缀名
          multiHeader: [['姓名', '主要信息', '', '', '', '', '部门']], // 复杂表头
          merges: ['A1:A2', 'B1:F1', 'G1:G2'] // 合并选项
        })
      })
    },

    // 得到一个二维数组
    formatFn(headers, rows) {
      // 1. rows决定有多少行，就是多少个小数组
      // 2. 列头，决定有多少列，就是小数组有多少列
      const resultArr = []
      rows.forEach(item => {
        const arr = []
        Object.keys(headers).forEach(key => {
          const englishKey = headers[key]
          let value = item[englishKey]
          if (['timeOfEntry', 'correctionTime'].includes(englishKey)) {
            value = dayjs(value).format('YYYY年MM月DD日')
          }
          if (englishKey === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(hireTypeObj => hireTypeObj.id === +value)
            value = obj ? obj.value : '暂无'
          }
          arr.push(value)
        })
        resultArr.push(arr)
      })
      return resultArr
    },

    formatDate(date, fmt = 'yyyy-MM-dd') {
      if (!(date instanceof Array)) {
        date = new Date(date)
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          const str = o[k] + ''
          fmt = fmt.replace(
            RegExp.$1,
            // eslint-disable-next-line no-undef
            RegExp.$1.length === 1 ? str : padLeftZero(str)
          )
        }
      }
      return fmt
    }
  }
}
</script>
