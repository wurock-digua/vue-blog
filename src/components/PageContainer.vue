<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">{{ title }}</h2>
        <div class="header-extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </div>
    
    <div class="page-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  .page-header {
    background: linear-gradient(to right, #f8f9fa, #e9ecef);
    border-bottom: 1px solid #ebeef5;
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 25px;
      
      .page-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #495057;
      }
      
      .header-extra {
        display: flex;
        align-items: center;
      }
    }
  }
  
  .page-content {
    padding: 25px;
    background: #fff;
  }
}
</style>