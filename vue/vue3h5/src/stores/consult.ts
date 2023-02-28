import type { ConsultType } from '@/enums'
import type { ConsultIllness, PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultStore = defineStore(
  'consult',
  () => {
    // 后台需要的数据
    const consult = ref<PartialConsult>({})

    // 就诊类型1找医生 2极速问诊 3开药问诊默认是1
    const setType = (type: ConsultType) => (consult.value.type = type)
    // 使用优惠券，必传可使用优惠券id
    const setCoupon = (couponId: string) => (consult.value.couponId = couponId)
    // 极速问诊类型：0普通 1三甲
    const setIllnessType = (illnessType: 0 | 1) => (consult.value.illnessType = illnessType)
    // 患者id，用于关联患者信息
    const setPatient = (patientId: string) => (consult.value.patientId = patientId)
    // 选择的科室id-极速问诊必填(选择的科室)
    const setDep = (depId: string) => (consult.value.depId = depId)
    // 在一个页面需要这几个数据，所以这几个数据都在一个方法里
    // 其它方法都是一个页面需要一个，所以有很多方法
    const setIllness = (illness: ConsultIllness) => {
      consult.value.illnessDesc = illness.illnessDesc // 病情--症状描述
      consult.value.illnessTime = illness.illnessTime // 找医生/极速问诊-患病时间1一周内2一月内3半年内4半年以上
      consult.value.consultFlag = illness.consultFlag // 找医生/极速问诊-是否就诊过0未就诊1就诊过
      consult.value.pictures = illness.pictures // 补充病例信息-图片集合
    }

    // 数据提交给了后台，后台根据数据生成了订单，前端不需要这个数据了，清除数据
    const clear = () => (consult.value = {})

    return {
      consult,
      setDep,
      setType,
      setIllnessType,
      setIllness,
      setPatient,
      setCoupon,
      clear
    }
  },

  { persist: true }
)
