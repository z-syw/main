<template>
  <div class="patient-page">
    <cp-nav-bar :title="isChange ? '选择患者' : '家庭档案'" />

    <div class="patient-change" v-if="isChange">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>

    <!-- 患者列表 -->
    <div class="patient-list">
      <div
        class="patient-item"
        v-for="item in list"
        :key="item.id"
        @click="selectPatient(item)"
        :class="{ selected: item.id === patientId }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">
            {{ item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2') }}
          </span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div @click="showPopup(item)" class="icon"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="list.length < 6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>

    <!-- 下一步 -->
    <div class="patient-next" v-if="isChange" @click="next">
      <van-button type="primary" round block>下一步</van-button>
    </div>

    <!-- 弹层 -->
    <van-popup v-model:show="show" position="right">
      <cp-nav-bar
        rightText="保存"
        @click-right="submit"
        :back="() => (show = false)"
        :title="patient.id ? '编辑患者' : '添加患者'"
      />
      <van-form autocomplete="off">
        <van-field v-model="patient.name" label="真实姓名" placeholder="请输入真实姓名" />
        <van-field v-model="patient.idCard" label="身份证号" placeholder="请输入身份证号" />
        <van-field label="性别">
          <template #input>
            <cp-radio-btn v-model="patient.gender" :options="options" />
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox v-model="defaultFlag" round />
          </template>
        </van-field>
        <van-action-bar v-if="patient.id">
          <van-action-bar-button @click="remove">删除</van-action-bar-button>
        </van-action-bar>
      </van-form>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import Validator from 'id-validator'
import type { Patient } from '@/types/user'
import { useRoute, useRouter } from 'vue-router'
import { getPatientListAPI, editPatientAPI, addPatientAPI, delPatientAPI } from '@/services/user'
import { showConfirmDialog, showSuccessToast, showToast } from 'vant'
import { computed, onMounted, ref } from 'vue'
import { useConsultStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const store = useConsultStore()

// 组件初始化时加载数据，问诊-查询患者列表信息API
const list = ref<Patient[]>([]) // 接收后台返回的数据
const loadList = async () => {
  const { data } = await getPatientListAPI()
  list.value = data
  changeDefualutPatient()
}
onMounted(() => {
  loadList()
})

// 弹层
const show = ref(false)
// 单选按钮
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
// 表单数据
const patient = ref<Patient>({
  name: '', // 患者姓名
  idCard: '', // 患者身份证号
  gender: 1, // 性别 1男 0女
  defaultFlag: 0 // 是否设置为默认患者 0不是默认 1是默认患者
})
// 复选框收集的是true和false，我需要的是0|1
const defaultFlag = computed({
  // 有人读取defaultFlag的值，get就会被调用，且返回值就是defaultFlag的值
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  // 对计算属性赋值，触发set，有人修改defaultFlag的值，会获取到修改的value值
  set(value) {
    patient.value.defaultFlag = value ? 1 : 0
  }
})

// 点击添加患者和编辑患者，打开弹层，右上角的保存按钮逻辑
const submit = async () => {
  if (!patient.value.name) return showToast('请输入真实姓名') // 表单校验
  if (!patient.value.idCard) return showToast('请输入身份证号') // 表单校验
  const validate = new Validator() // 身份证号校验
  if (!validate.isValid(patient.value.idCard)) return showToast('身份证格式错误')
  const { sex } = validate.getInfo(patient.value.idCard) // 包提供的方法，取出性别
  if (patient.value.gender !== sex) return showToast('性别和身份证不符')
  // 校验完成之后，发请求。添加/编辑患者
  patient.value.id ? await editPatientAPI(patient.value) : await addPatientAPI(patient.value)
  show.value = false // 关闭弹层
  loadList() // 拉取数据，更新列表
  showSuccessToast(patient.value.id ? '编辑成功' : '添加成功') // 提示用户
}

// 编辑患者和添加患者用的是同一个按钮
// 如何区分点击的是添加还是编辑？点击编辑时需要做数据回显，把item传过来，就是编辑按钮
// 在添加患者使用此方法时，showPopup()，不加小括号默认传入的是事件对象，所以这里需要加括号
const showPopup = (item?: Patient) => {
  if (item) {
    // 如果是编辑患者，需要做数据回显，做数据回显时，取出id，是为了给后台使用
    const { id, gender, name, idCard, defaultFlag } = item
    patient.value = { id, gender, name, idCard, defaultFlag }
  } else {
    patient.value = {
      name: '',
      idCard: '',
      defaultFlag: 0,
      gender: 1
    }
  }
  show.value = true // 打开弹层
}

// 删除患者
const remove = async () => {
  // 点击编辑患者时，取出来了id数据，存到了patient里，所以删除时可以根据这个id进行删除
  if (patient.value.id) {
    try {
      await showConfirmDialog({
        title: '温馨提示',
        message: `您确认要删除 ${patient.value.name} 患者信息吗`,
        cancelButtonText: '取消',
        confirmButtonText: '确认'
      })
      await delPatientAPI(patient.value.id) // 调用接口，传入需要删除的id
      show.value = false // 关闭弹窗
      loadList() // 重新拉取数据
      showSuccessToast('删除成功') // 提示用户
    } catch (error) {
      //
    }
  }
}

// 是否是选择患者
const isChange = computed(() => route.query.isChange === '1')
// 记录用户点击的哪个选项，做高亮效果
const patientId = ref<string>()
const selectPatient = (item: Patient) => {
  if (isChange.value) patientId.value = item.id
}
// 当前组件初始化好之后，发完请求，获取了个人信息之后，做默认选中
// 如何做默认选中？上一步已经做好了高亮效果，只需要更改高亮的id即可
const changeDefualutPatient = () => {
  if (isChange.value && list.value.length) {
    const defPatient = list.value.find(item => item.defaultFlag === 1)
    if (defPatient) patientId.value = defPatient.id
    else patientId.value = list.value[0].id
  }
}
// 下一步
const next = () => {
  if (!patientId.value) return showToast('请选择就诊患者')
  store.setPatient(patientId.value)
  router.push('/consult/pay')
}
</script>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;

  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}

.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;

  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}

.patient-list {
  padding: 15px;
}

.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;

  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;

    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;

      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }

      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }

  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }

  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);

    .icon {
      color: var(--cp-primary);
    }
  }
}

.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;

  .cp-icon {
    font-size: 24px;
  }
}

.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}

.patient-change {
  padding: 15px;

  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }

  > p {
    color: var(--cp-text3);
  }
}

.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
</style>
