<script setup>
import { defineProps } from 'vue';

defineProps({
  title: {
    required: true,
    type: String,
  }
});
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      font-size: 18px;
      font-weight: 600;
      color: #495057;
    }
    
    .extra {
      display: flex;
      align-items: center;
    }
  }
}
</style>