<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { userUpdateInfoService } from '@/api/user'

const formRef = ref()
const {
  user: { id, username, nickname, email },
  getUser
} = useUserStore()
const form = reactive({
  id,
  username,
  nickname,
  email
})

const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { pattern: /^\S{2,10}$/, message: '昵称长度为2-10位非空字符串', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ]
}

const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 提交逻辑
      await userUpdateInfoService(form.value)
        .then(() => {
          getUser() // 更新pinia中的用户信息
          ElMessage.success('用户信息更新成功')
        })
        .catch((error) => {
          ElMessage.error(`更新失败: ${error.message}`)
        })
    }
  })
}
</script>

<template>
  <page-container title="基本资料">
    <el-row>
      <el-col :span="12">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="user-profile-form">
          <!-- 登录名称（禁用） -->
          <el-form-item label="登录名称">
            <el-input v-model="form.username" disabled />
          </el-form-item>

          <!-- 用户昵称 -->
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="form.nickname" />
          </el-form-item>

          <!-- 用户邮箱 -->
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>

          <!-- 提交按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>

</template>

<style lang="scss" scoped>
.user-profile-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin-top: 20px;
  
  :deep(.el-form-item) {
    margin-bottom: 24px;
    
    .el-form-item__label {
      font-weight: 500;
      color: #495057;
      padding-right: 12px;
    }
    
    .el-input__inner {
      border-radius: 0;
      border: 1px solid #dcdfe6;
      transition: all 0.3s ease;
      padding: 12px 15px;
      
      &:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        outline: none;
      }
      
      &[disabled] {
        background-color: #f5f7fa;
        color: #999;
      }
    }
    
    &.is-error {
      .el-input__inner {
        border-color: #f56c6c;
        box-shadow: 0 0 0 3px rgba(245, 108, 108, 0.1);
      }
    }
  }
  
  :deep(.el-button) {
    &.el-button--primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      padding: 12px 30px;
      
      &:hover {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
      }
    }
  }
}
</style>
