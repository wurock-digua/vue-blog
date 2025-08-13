import axios from 'axios'

const baseURL = 'http://localhost:3000' // 设置为 json-server 地址

const instance = axios.create({
  baseURL,
  timeout: 10000,
})

export default instance
