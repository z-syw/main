import type { IllnessTime } from '@/enums'
import { timeOptions, flagOptions } from '@/services/constants'

// 患病时长
export const getIllnessTimeText = (time?: IllnessTime) => timeOptions.find(item => item.value === time)?.label
// 就诊情况
export const getConsultFlagText = (flag?: 0 | 1) => flagOptions.find(item => item.value === flag)?.label
