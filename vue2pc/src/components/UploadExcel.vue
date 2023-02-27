<template>
  <div class="upload-excel">
    <!-- 按钮盒子 -->
    <div class="btn-upload">
      <el-button :loading="loading" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>

    <!-- 隐藏的input -->
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">

    <!-- 拖拽盒子 -->
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
// 这是H5新增的拖拽盒子，事件都是原生事件
// @dragover和@dragenter是用来解决兼容性的
// @dragenter：你拖了一个文件，拖到进入盒子范围了
// @dragover：你拖了一个文件，拖到进入盒子范围了，但是没松手，一直在晃
// @drop这个重要：你拖了一个文件，拖到进入盒子范围了，送手了，就可以拿到选择的文件

export default {
  name: 'UploadExcel',
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      // 将得到的结果，通过调用onSuccess函数，给到调用者
      this.onSuccess && this.onSuccess(this.excelData)
    },

    // 拖拽上传
    handleDrop(e) {
      // 阻止冒泡，组织默认行为，是用来解决兼容性的。阻止浏览器的默认下载效果
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files // 获取拖拽过来的文件
      // 如果拖拽过来的文件数量不等于1个
      if (files.length !== 1) {
        this.$message.error('一次只支持上传一个文件')
        return
      }
      const rawFile = files[0] // 只有一个文件，取出来这个文件
      // 文件格式校验
      if (!this.isExcel(rawFile)) {
        this.$message.error('仅支持上传 .xlsx, .xls, .csv 文件格式')
        return false
      }
      this.upload(rawFile) // 开始解析文件
      e.stopPropagation()
      e.preventDefault()
    },

    // 阻止了冒泡和默认行为，解决兼容性
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },

    // 点击按钮，触发了input框的file的点击事件
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },

    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },

    // rawFile：上传的文件
    upload(rawFile) {
      // 文件以拿到，如果input：file框有值，清掉
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      // 如果在使用此组件时，有没有配置beforeUpload校验函数
      if (!this.beforeUpload) {
        // 不存在，说明不做校验，开始去做解析文件
        this.readerData(rawFile)
        return
      }
      // 传入了beforeUpload函数，就使用beforeUpload进行校验
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },

    // 解析上传的文件
    readerData(rawFile) {
      this.loading = true
      // 读文件是一个异步操作，如果你希望在读完文件之后，做某件事，通过promise封装
      return new Promise((resolve, reject) => {
        const reader = new FileReader() // 创建FileReader读取器，H5新出的，读取文件的api
        // 监听文件的读取，读完成了，会自动调用onload
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results }) // 读完的结果
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile) // 调用方法，开始读
      })
    },

    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },

    // 封装一个正则，校验文件的格式
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin-top: 100px;

  .excel-upload-input {
    display: none;
    z-index: -9999;
  }

  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }

  .drop {
    padding-top: 20px;
    line-height: 80px;
    color: #bbb;

    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>
