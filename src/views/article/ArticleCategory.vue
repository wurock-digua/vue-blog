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
const onDeleteCategory = (row) => {
  // 确认删除分类
  ElMessageBox.confirm('确认删除该分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true,
    draggable: false,
    roundButton: true,
    customClass: 'article-category-message-box',
    lockScroll: true,
    closeOnClickModal: false,
    closeOnPressEscape: false
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

    <el-table :data="categoryList" stripe>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="categoryName" label="分类名称"></el-table-column>
      <el-table-column prop="categoryAlias" label="分类别名"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
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
// 美化表格样式
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .el-table__header th {
    background-color: #f5f7fa;
    color: #495057;
    font-weight: 600;
    padding: 15px 0;
    text-align: center;
    /* 表头文字居中对齐 */
  }

  .el-table__row {
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #f8f9fa;
    }
  }

  .el-table__cell {
    padding: 12px 0;
    text-align: center;
    /* 单元格内容居中对齐 */
  }
}

// 美化按钮
:deep(.el-button) {
  &.el-button--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;

    &:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }
  }

  &.el-button--danger {
    background: linear-gradient(135deg, #f56c6c 0%, #e64c4c 100%);
    border: none;
    color: white;

    &:hover {
      background: linear-gradient(135deg, #e64c4c 0%, #f56c6c 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(245, 108, 108, 0.3);
    }
  }

  &.el-button--default {
    border-color: #dcdfe6;
    color: #606266;
    background: white;

    &:hover {
      border-color: #667eea;
      color: #667eea;
      transform: translateY(-1px);
    }
  }
}

// 美化空状态
:deep(.el-empty) {
  padding: 40px 0;
}

// 优化 ElMessageBox 显示效果和位置
:deep(.article-category-message-box) {
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid #e4e7ed;
  max-width: 420px;
  width: auto;
  padding: 0;
  margin: 0 !important;
  position: relative;

  .el-message-box__header {
    padding: 20px 20px 10px;

    .el-message-box__title {
      font-weight: 600;
      color: #303133;
      font-size: 18px;
    }

    .el-message-box__headerbtn {
      top: 20px;
      right: 20px;

      .el-message-box__close {
        color: #909399;
        width: 16px;
        height: 16px;

        &:hover {
          color: #409eff;
        }
      }
    }
  }

  .el-message-box__content {
    padding: 30px 20px;
    color: #606266;
    font-size: 16px;
    line-height: 1.6;
    text-align: center;
  }

  .el-message-box__btns {
    padding: 15px 20px 25px;
    text-align: center;

    .el-button {
      min-width: 80px;
      border-radius: 4px;
      padding: 9px 20px;
      font-size: 14px;
      font-weight: 500;

      +.el-button {
        margin-left: 20px;
      }
    }
  }
}

// 优化确认框按钮样式
:deep(.article-category-message-box .el-message-box__btns) {
  .el-button--primary {
    background-color: #409eff;
    border-color: #409eff;
    color: white;

    &:hover {
      background-color: #66b1ff;
      border-color: #66b1ff;
      transform: translateY(-2px);
    }

    &:focus {
      background-color: #409eff;
      border-color: #409eff;
    }

    &:active {
      transform: translateY(0);
    }
  }

  .el-button--danger {
    background-color: #f56c6c;
    border-color: #f56c6c;
    color: white;

    &:hover {
      background-color: #f78989;
      border-color: #f78989;
      transform: translateY(-2px);
    }

    &:focus {
      background-color: #f56c6c;
      border-color: #f56c6c;
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 优化 ElMessageBox 位置和可见性
:deep(.el-message-box__wrapper) {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2001;
  // 增强优先级
  pointer-events: none;
}

// 确保消息框居中
:deep(.el-message-box) {
  margin: 0 !important;
  vertical-align: middle;
  // 添加额外的居中样式
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
