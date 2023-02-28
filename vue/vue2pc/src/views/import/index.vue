<template>
  <UploadExcel :on-success="handleSuccess" :before-upload="beforeUpload" />
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
  name: 'Import',
  methods: {
    // 员工
    async handleEmployeeBatch(header, results) {
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      // 准备一个新对象，新对象的键名更新成英文的，值不变
      const arr = []
      results.forEach(item => {
        const obj = {}
        for (const k in item) {
          const englishKey = userRelations[k]

          // 处理日期格式问题
          // if (englishKey === 'timeOfEntry' || englishKey === 'correctionTime') {
          if (['timeOfEntry', 'coorectionTime'].includes(englishKey)) {
            obj[englishKey] = this.formatExcelDate(item[k], '/')
          } else {
            obj[englishKey] = item[k]
          }
        }
        arr.push(obj)
      })

      try {
        await importEmployee(arr)
        this.$message.success('导入成功')
        this.$router.back()
      } catch (error) {
        this.$message.error('手机号重复，请重新导入')
        this.$router.back()
      }
    },

    // 配置上传成功解析完成后的函数
    handleSuccess({ header, results }) {
      if (this.$route.query.type === 'user') {
        this.handleEmployeeBatch(header, results)
      }
    },

    // 配置上传前的校验
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1 // file.size：文件大小，单位字节B，KB，MB，小于1M
      if (isLt1M) return true // 小于1M，通过校验
      this.$message({ type: ' warning', message: '请上传小于1M的文件' })
      return false // 大于1M不通过校验
    },

    // 处理日期格式
    // format是个分隔符
    formatExcelDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1) // 毫秒
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
