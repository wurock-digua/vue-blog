import request from '@/utils/request'

// 登录接口
export const userLoginService = (data) => {
  return request.post('/user/login', data)
}

// 注册接口
export const userRegisterService = (data) => {
  return request.post('/user/register', data)
}

// 获取用户基本信息
export const userGetInfoService = () => {
  return request.get('/user/userInfo')
}

// 更新用户基本信息
export const userUpdateInfoService = (data) => {
  return request.put('/user/update', data)
}

// 更新用户头像
export const userUpdateAvatarService = (data) => {
  return request.put('/user/updateAvatar', data)
}

// 更新用户密码
export const userUpdatePasswordService = (data) => {
  return request.put('/user/updatePwd', data)
}
