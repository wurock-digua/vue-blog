<script setup>
import { ref } from 'vue';
import { articleAddCategoryService, articleEditCategoryService } from '@/api/article';

const dialogVisible = ref(false);
const formModel = ref({
  categoryName: '',
  categoryAlias: ''
});

const rules = {
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '分类名称必须为1-10个非空字符', trigger: 'blur' }
  ],
  categoryAlias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须为1-15个字母或数字', trigger: 'blur' }
  ]
}

// 打开弹窗
const open = (row) => {
  dialogVisible.value = true;
  formModel.value = { ...row };
}
defineExpose({
  open
});

// 添加/编辑分类，提交表单
const formRef = ref();
const emit = defineEmits(['success']);
const onSubmit = async () => {
  const isValid = await formRef.value.validate();
  if (!isValid) return;

  if (formModel.value.id) {
    // 编辑分类
    await articleEditCategoryService(formModel.value);
  } else {
    // 添加分类
    await articleAddCategoryService(formModel.value);
  }
  dialogVisible.value = false;
  emit('success');
}
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'">
    <el-form ref="formRef" :model="formModel" :rules="rules">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="formModel.categoryName" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="categoryAlias">
        <el-input v-model="formModel.categoryAlias" placeholder="请输入分类别名"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
