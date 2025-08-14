import request from '@/utils/request'

// 获取文章分类
export const articleGetCategoryService = () => {
  return request.get('/article/category')
}

// 添加文章分类
export const articleAddCategoryService = (data) => {
  return request.post('/article/category', data)
}

// 编辑文章分类
export const articleEditCategoryService = (data) => {
  return request.put(`/article/category`, data)
}

// 删除文章分类
export const articleDeleteCategoryService = (id) => {
  return request.delete(`/article/category`, {
    params: { id },
  })
}
