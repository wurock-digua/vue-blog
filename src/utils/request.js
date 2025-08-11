import axios from 'axios'

const baseURL = ''

const instance = axios.create({
  baseURL,
  timeout: 10000,
})

export default instance
