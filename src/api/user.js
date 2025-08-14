import request from '@/utils/request'

// 登录接口
export const userLoginService = (data) => {
  return request.post('/user/login', data)
}

// 注册接口
export const userRegisterService = (data) => {
  return request.post('/user/register', data)
}

// 获取用户信息
export const userGetInfoService = () => {
  return request.get('/user/userInfo')
}
