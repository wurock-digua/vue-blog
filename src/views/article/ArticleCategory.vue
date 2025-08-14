<script setup>
import { Edit, Delete } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import { ref, onMounted } from 'vue';
import { articleGetCategoryService, articleDeleteCategoryService } from '@/api/article';
import EditArticleCategory from './components/EditArticleCategory.vue';

const categoryList = ref([]);

// 获取文章分类
const getArticleCategory = async () => {
  const res = await articleGetCategoryService();
  categoryList.value = res.data;
  // console.log(res);
}
onMounted(() => {
  getArticleCategory();
});

// 添加/编辑分类时显示弹窗
const dialog = ref()
const onAddCategory = () => {
  // TODO: 打开添加分类弹窗
  dialog.value.open({});
}

const onEditCategory = (row) => {
  // TODO: 打开编辑分类弹窗
  dialog.value.open(row)
}

// 添加/编辑分类成功后刷新表格数据
const onSuccess = () => {
  getArticleCategory();
}

// 删除分类
const onDeleteCategory = (row) => {
  // TODO: 确认删除分类
  ElMessageBox.confirm('确认删除该分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await articleDeleteCategoryService(row.id);
    getArticleCategory();
  }).catch(() => { });
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddCategory"> 添加分类 </el-button>
    </template>

    <el-table :data="categoryList">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="categoryName" label="分类名称"></el-table-column>
      <el-table-column prop="categoryAlias" label="分类别名"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row, $index }">
          <el-button circle type="primary" @click="onEditCategory(row, $index)">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>

          <el-button circle type="primary" @click="onDeleteCategory(row, $index)">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </page-container>
  <edit-article-category ref="dialog" @success="onSuccess" />
</template>
