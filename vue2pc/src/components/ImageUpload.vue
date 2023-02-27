<template>
  <div>
    <el-upload
      list-type="picture-card" action="#" :file-list="fileList" :on-preview="handlePictureCardPreview"
      :limit="limit" :class="{ disbaled: isDisibaled }" :on-remove="handleRemove" :http-request="handleUpload"
      :on-change="handleChange" :before-upload="handleBeforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog title="图片预览" :visible="visible" @close="visible = false">
      <img :src="imgUrl" style="width:100%;">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDhFbszua3QehfS2PZVDi05xc4JNFvOegU',
  SecretKey: 'iFYdUpzwgDYgbLsDKCsMdjgQxIRM4atz'
})
export default {
  name: 'ImageUpload',
  props: {
    limit: { type: Number, default: 1 }
  },
  data() {
    return {
      visible: false,
      fileList: [],
      imgUrl: ''
    }
  },
  computed: {
    // 控制+号什么时候显示
    isDisibaled() {
      return this.fileList.length >= this.limit
    },
    // 必须每一个fileList中的status都要是success
    isAllUploadSuccess() {
      return this.fileList.every(item => item.status === 'success')
    }
  },

  methods: {
    // 预览
    handlePictureCardPreview(file) {
      this.imgUrl = file.url
      this.visible = true
    },

    // 删除
    handleRemove(file, fileList) {
      // file：要删除的那个对象；fileList：结构中的fileList；this.fileList：自己数据中的fileList
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },

    // 选择文件，上传成功，上传失败，都希望结构和数据同步
    handleChange(file, fileList) {
      this.fileList = [...fileList]
    },

    // 上传前的校验
    handleBeforeUpload(file) {
      // const isLt2M = file.size / 1024 / 1024 < 2
      // if (isLt2M) {
      //   this.$message.error('上传图片大小不能超过 2M')
      //   return false
      // }
      // return true
    },

    // 上传
    handleUpload(obj) {
      const uid = obj.file.uid
      const fileObj = this.fileList.find(item => item.uid === uid)

      fileObj.status = 'uploading'

      // file需要上传的文件对象
      cos.putObject({
        Bucket: 'admin-1312518793', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-shanghai', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: obj.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: obj.file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        // 进度条，每上传一部分自动触发
        onProgress: progressData => {
          fileObj.percentage = parseInt(progressData.percent * 100)
        }
      }, (err, data) => {
        if (err) return
        fileObj.url = 'https://' + data.Location
        setTimeout(() => {
          fileObj.status = 'success'
        }, 300)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.disbaled {
  ::v-deep {
    .el-upload--picture-card {
      display: none;
    }
  }
}
</style>
