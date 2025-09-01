<script setup>
import { ref, onMounted } from 'vue';
import { Edit, Delete } from '@element-plus/icons-vue';
import SelectArticleCategory from './components/SelectArticleCategory.vue';
import { articleGetListService, articleDeleteService, articleGetCategoryService } from '@/api/article';
import { formatDate } from '@/utils/format';
import EditArticle from './components/EditArticle.vue';
import { ElMessageBox } from 'element-plus';
import 'element-plus/theme-chalk/el-message-box.css'; // MessageBox 核心样式

const articleList = ref([]);
const total = ref(6);
const params = ref({
  pageNum: 1,
  pageSize: 5,
  categoryId: null,
  state: ''
});

// 获取文章分类列表
const categoryList = ref([]);
const getArticleCategoryList = async () => {
  const res = await articleGetCategoryService();
  categoryList.value = res.data.data;
};

// 根据ID获取分类名称
const getCategoryName = (id) => {
  const category = categoryList.value.find(item => item.id === id);
  return category ? category.categoryName : '未知分类';
};

// 获取文章列表
const getArticleList = async () => {
  const res = await articleGetListService(params.value)
  articleList.value = res.data.data.items;
  total.value = res.data.data.total;
}

onMounted(async () => {
  await getArticleCategoryList();
  await getArticleList();
});

// 删除文章
const onDeleteArticle = async (row) => {
  ElMessageBox.confirm('确认删除该文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await articleDeleteService(row.id);
    getArticleList();
  });
};

// 根据条件搜索文章列表
const onSearch = async () => {
  params.value.pageNum = 1; // 重置页码为1
  await getArticleList();
};

// 重置搜索条件
const onReset = async () => {
  params.value.categoryId = '';
  params.value.state = '';
  params.value.pageNum = 1; // 重置页码为1
  await getArticleList();
};

// 分页切换
const onSizeChange = async (size) => {
  params.value.pageSize = size;
  params.value.pageNum = 1;
  await getArticleList();
};
// 当前页码切换
const onCurrentChange = async (page) => {
  params.value.pageNum = page;
  await getArticleList();
};

// 添加/编辑文章弹框显示
const editArticleRef = ref()
const onAddArticle = () => {
  editArticleRef.value.open({})
}
const onEditArticle = (row) => {
  editArticleRef.value.open(row);
};

// 添加或编辑文章成功后回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pageSize);
    params.value.pageNum = lastPage; // 新增文章后，重置页码为最后一页
    getArticleList();
  } else if (type === 'edit') {
    // 如果是编辑渲染当前页
    getArticleList();
  }
};
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" label-position="left" label-width="80px">
        <el-form-item label="文章分类">
          <select-article-category v-model="params.categoryId" class="search-select" />
        </el-form-item>

        <el-form-item label="发布状态">
          <el-select v-model="params.state" placeholder="请选择" class="search-select">
            <el-option label="草稿" value="草稿"></el-option>
            <el-option label="已发布" value="已发布"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 文章列表 -->
    <el-table :data="articleList" stripe style="width: 100%">
      <el-table-column prop="title" label="标题">
        <template #default="{ row }">
          <el-link :underline="false" type="primary">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="categoryId" label="分类">
        <template #default="{ row }">
          {{ getCategoryName(row.categoryId) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" circle size="small" @click="onEditArticle(row)">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>
          <el-button type="danger" circle size="small" @click="onDeleteArticle(row)">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination v-model:current-page="params.pageNum" v-model:page-size="params.pageSize" :page-sizes="[2, 3, 5, 10]"
      :background="true" layout="jumper, total, sizes, prev, pager, next" :total="total" @size-change="onSizeChange"
      @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end">
    </el-pagination>

    <!-- 添加/编辑文章弹框 -->
    <edit-article ref="editArticleRef" @success="onSuccess" />
  </page-container>
</template>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);

  :deep(.el-card__body) {
    padding: 15px;
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  .search-select {
    width: 180px;
  }
}

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

// 分页组件
:deep(.el-pagination) {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);

  .el-pager li {
    border-radius: 2px;
    margin: 0 1px;

    &.is-active {
      background-color: #409eff;
    }
  }

  .btn-prev,
  .btn-next {
    border-radius: 2px;
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

// 链接样式
:deep(.el-link) {
  font-weight: 400;

  &:hover {
    color: #409eff;
  }
}
</style>
