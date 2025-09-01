<script setup>
import 'element-plus/theme-chalk/el-message-box.css'; // MessageBox 核心样式
import { Edit, Delete } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';
import { articleGetCategoryService, articleDeleteCategoryService } from '@/api/article';
import EditArticleCategory from './components/EditArticleCategory.vue';
import { formatDate } from '@/utils/format';

const categoryList = ref([]);

// 获取文章分类
const getArticleCategory = async () => {
  const res = await articleGetCategoryService();
  console.log('文章分类', res.data);
  categoryList.value = res.data.data;
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
const onDeleteCategory = async (row) => {
  await ElMessageBox.confirm('你确认要删除该分类么', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await articleDeleteCategoryService(row.id)
  ElMessage.success('删除成功')
  getArticleCategory()
};
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddCategory"> 添加分类 </el-button>
    </template>

    <el-table :data="categoryList" stripe>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="categoryName" label="分类名称"></el-table-column>
      <el-table-column prop="categoryAlias" label="分类别名"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间">
        <template #default="{ row }">
          {{ formatDate(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button circle type="primary" @click="onEditCategory(row)">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>

          <el-button circle type="danger" @click="onDeleteCategory(row)">
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

<style lang="scss" scoped>
// 表格样式
:deep(.el-table) {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);

  .el-table__header th {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: 500;
    padding: 10px 0;
  }

  .el-table__row {
    transition: background-color 0.3s;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .el-table__cell {
    padding: 8px 0;
  }
}

// 按钮样式
:deep(.el-button) {
  &.el-button--primary {
    background-color: #409eff;
    border: 1px solid #409eff;
    color: white;

    &:hover {
      background-color: #66b1ff;
      border-color: #66b1ff;
    }
  }

  &.el-button--danger {
    background-color: #f56c6c;
    border: 1px solid #f56c6c;
    color: white;

    &:hover {
      background-color: #f78989;
      border-color: #f78989;
    }
  }

  &.el-button--default {
    border-color: #dcdfe6;
    color: #606266;
    background: white;

    &:hover {
      border-color: #409eff;
      color: #409eff;
    }
  }
}

// 空状态
:deep(.el-empty) {
  padding: 30px 0;
}
</style>
