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

<style lang="scss" scoped></style>
