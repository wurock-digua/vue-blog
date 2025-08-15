<script setup>

</script>

<template>
  <el-card class="user-avatar-card">
    <template #header>
      <div class="card-header">
        <span>更换头像</span>
      </div>
    </template>
    <div class="avatar-content">
      <p>更换头像页面正在开发中...</p>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.user-avatar-card {
  max-width: 800px;
  margin: 0 auto;
  
  .card-header {
    font-size: 18px;
    font-weight: 600;
    color: #495057;
  }
  
  .avatar-content {
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