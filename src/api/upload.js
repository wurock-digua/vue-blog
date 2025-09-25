import request from '@/utils/request'

// 上传文件
export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  // return request.post('/upload', formData)
}
