<script setup>
import { ref, onMounted } from 'vue';
import { articleGetCategoryService } from '@/api/article';

// 获取文章分类
const categoryList = ref([]);
const getArticleCategory = async () => {
  const response = await articleGetCategoryService();
  categoryList.value = response.data;
};
onMounted(() => {
  getArticleCategory();
});

// 父子组件双向绑定数据
defineProps({
  modelValue: {
    type: [Number, String]
  }
});
const emit = defineEmits(['update:modelValue']);

</script>

<template>
  <el-select :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)" placeholder="请选择">
    <el-option v-for="category in categoryList" :key="category.id" :label="category.categoryName" :value="category.id">
    </el-option>
  </el-select>
</template>
