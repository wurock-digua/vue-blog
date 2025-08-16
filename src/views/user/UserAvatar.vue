<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { userUpdateAvatarService } from '@/api/user'
const userStore = useUserStore()
const imgUrl = ref(userStore.user.avatarUrl)
const uploadRef = ref(null)

const onSelectFile = (file) => {
  // 基于FileReader读取上传的图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}

const onUpdateAvatar = async () => {
  // 发送请求更新头像
  await userUpdateAvatarService(imgUrl.value)
  // userStore重新渲染
  await userStore.getUser()
  ElMessage.success('头像更新成功')
}
</script>

<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <div class="user-avatar-form">
          <div class="avatar-container">
            <el-upload ref="uploadRef" class="avatar-uploader" :auto-upload="false" :show-file-list="false" :on-change="onSelectFile">
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <div v-else class="avatar-uploader-icon">
                <el-icon><Plus /></el-icon>
              </div>
            </el-upload>
          </div>
          
          <div class="button-group">
            <el-button @click="uploadRef.$el.querySelector('input').click()" :icon="Plus" type="primary"
              size="large">选择图片</el-button>
            <el-button @click="onUpdateAvatar" :icon="Upload" type="success" size="large">上传头像</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
.user-avatar-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 20px auto 0;
  
  .avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }

  .avatar-uploader {
    border: 2px dashed #d9d9d9;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #667eea;
      background-color: rgba(102, 126, 234, 0.05);
    }
    
    .avatar {
      width: 200px;
      height: 200px;
      object-fit: cover;
    }
    
    .avatar-uploader-icon {
      width: 200px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed #d9d9d9;
      
      .el-icon {
        font-size: 48px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        border: 2px solid #d9d9d9;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        
        &:hover {
          color: #667eea;
          border-color: #667eea;
        }
      }
    }
  }

  .button-group {
    display: flex;
    gap: 20px;
    justify-content: center;
    
    .el-button {
      border-radius: 0;
      padding: 12px 30px;
      font-size: 16px;
      transition: all 0.3s ease;
      
      &.el-button--primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        
        &:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      }
      
      &.el-button--success {
        background: linear-gradient(135deg, #67c23a 0%, #4e9e2e 100%);
        border: none;
        
        &:hover {
          background: linear-gradient(135deg, #4e9e2e 0%, #67c23a 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
        }
      }
    }
  }
}
</style>
