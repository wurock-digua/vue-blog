import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'

export const useUserStore = defineStore(
  'blog-user',
  () => {
    // Token
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    // 用户信息
    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data
    }
    const setUser = (obj) => {
      user.value = obj
    }
    return { token, setToken, removeToken, user, getUser, setUser }
  },
  {
    persist: true,
  },
)
