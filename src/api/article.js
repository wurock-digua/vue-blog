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

// 根据搜索条件获取文章列表
export const articleGetListService = (data) => {
  return request.get('/article', data)
}

// 新增文章
export const articleAddService = (data) => {
  return request.post('/article', data)
}

// 编辑文章
export const articleEditService = (data) => {
  return request.put(`/article`, data)
}

// 删除文章
export const articleDeleteService = (id) => {
  return request.delete(`/article`, {
    params: { id },
  })
}

// 获取文章详情
export const articleGetDetailService = (id) => {
  return request.get(`/article/${id}`)
}
