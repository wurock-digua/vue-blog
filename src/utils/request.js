import axios from 'axios'
import { useUserStore } from '@/stores/modules/user'
import router from '@/router'
import { ElMessage } from 'element-plus'

const baseURL = 'http://localhost:8080' // 设置为 json-server 地址

const instance = axios.create({
  baseURL,
  timeout: 10000,
})

// 添加拦截器
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code === 0) {
      return response
    }
    // 处理其他状态码
    ElMessage.error(response.data.message || '服务异常')
    return Promise.reject(response.data)
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.response) {
      const { status, data } = error.response
      // 根据不同的状态码做不同的处理
      if (status === 401) {
        // 未授权
        router.push('/user/login')
      } else {
        ElMessage.error(data.message || '服务异常')
      }
    }
    return Promise.reject(error)
  },
)

export default instance
export { baseURL }
