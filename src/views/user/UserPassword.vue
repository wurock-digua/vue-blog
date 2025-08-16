<script setup>
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const formRef = ref()
const form = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

const checkDifferent = (rule, value, callback) => {
  if (value === form.value.old_pwd) {
    callback(new Error('新密码不能与旧密码相同'))
  } else {
    callback()
  }
}

const checkSameNewPwd = (rule, value, callback) => {
  if (value !== form.value.new_pwd) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '原密码长度在6-15位之间', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '新密码长度在6-15位之间', trigger: 'blur' },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '新密码长度在6-15位之间', trigger: 'blur' },
    { validator: checkSameNewPwd, trigger: 'blur' }
  ]
}

const userStore = useUserStore()
const router = useRouter()
const onSubmit = async () => {
  try {
    await formRef.value.validate()
    await userUpdatePasswordService(form.value)
    ElMessage.success('密码更新成功')
  } catch (error) {
    ElMessage.error(`更新失败: ${error.message}`)
  }

  // 密码修改成功后，退出重新登录
  // 清空本地存储的 token 和 个人信息
  userStore.setToken('')
  userStore.setUser({})
  router.push('/login')
}

// 重置表单函数
const resetForm = () => {
  form.value = {
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
  }
}

</script>

<template>
  <page-container title="重置密码">
    <el-row>
      <el-col :span="12">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="password-form">
          <el-form-item label="旧密码" prop="old_pwd">
            <el-input v-model="form.old_pwd" type="password" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="form.new_pwd" type="password" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="re_pwd">
            <el-input v-model="form.re_pwd" type="password" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
.password-form {
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
    }
    
    &.is-error {
      .el-input__inner {
        border-color: #f56c6c;
        box-shadow: 0 0 0 3px rgba(245, 108, 108, 0.1);
      }
    }
    
    .el-button {
      margin-right: 10px;
      
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
      
      &.el-button--default {
        border-color: #dcdfe6;
        color: #606266;
        background: white;
        padding: 12px 30px;
        
        &:hover {
          border-color: #667eea;
          color: #667eea;
          transform: translateY(-1px);
        }
      }
    }
  }
}
</style>
