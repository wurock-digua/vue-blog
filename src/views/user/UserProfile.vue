<script setup>

</script>

<template>
  <el-card class="user-profile-card">
    <template #header>
      <div class="card-header">
        <span>基本信息</span>
      </div>
    </template>
    <div class="profile-content">
      <p>用户资料页面正在开发中...</p>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.user-profile-card {
  max-width: 800px;
  margin: 0 auto;
  
  .card-header {
    font-size: 18px;
    font-weight: 600;
    color: #495057;
  }
  
  .profile-content {
    text-align: center;
    padding: 60px 0;
    
    p {
      font-size: 16px;
      color: #6c757d;
      margin: 0;
    }
  }
}
</style>