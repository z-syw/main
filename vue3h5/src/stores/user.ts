import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 如果你指定了一个泛型参数但没有给出初始值，那么最后得到的就将是一个包含undefined的联合类型
    const user = ref<User>() // 没有给默认值，user是直接给赋值
    // 登录成功后，保存用户信息
    const setUser = (u: User) => (user.value = u)
    // 退出登录时，清空用户信息
    const delUser = () => (user.value = undefined)

    // 记录QQ登录需要的回跳地址
    const returnUrl = ref('')
    const updateReturnUrl = (url: string) => (returnUrl.value = url)

    return { user, returnUrl, setUser, delUser, updateReturnUrl }
  },

  { persist: true }
)
