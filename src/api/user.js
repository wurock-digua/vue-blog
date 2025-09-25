import request from '@/utils/request'

// 登录接口
export const userLoginService = (data) => {
  const params = new URLSearchParams()
  for (const key in data) {
    params.append(key, data[key])
  }
  return request.post('/user/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 注册接口
export const userRegisterService = (data) => {
  const params = new URLSearchParams()
  for (const key in data) {
    params.append(key, data[key])
  }
  return request.post('/user/register', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
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
export const userUpdateAvatarService = (avatarUrl) => {
  return request.patch('/user/updateAvatar', null, {
    params: { avatarUrl },
  })
}

// 更新用户密码
export const userUpdatePasswordService = (data) => {
  return request.patch('/user/updatePwd', data)
}
