<script setup>
import { ref, onMounted } from 'vue';
import { Edit, Delete } from '@element-plus/icons-vue';
import SelectArticleCategory from './components/SelectArticleCategory.vue';
import { articleGetListService, articleDeleteService } from '@/api/article';
import { formatDate } from '@/utils/format';
import EditArticle from './components/EditArticle.vue';
import { ElMessageBox } from 'element-plus';

const articleList = ref([]);
const total = ref(6);
const params = ref({
  pageNum: 1,
  pageSize: 5,
  categoryId: '',
  state: ''
});

// 获取文章列表
const getArticleList = async () => {
  const res = await articleGetListService(params.value)
  articleList.value = res.data;
  // total.value = res.total;
}

onMounted(async () => {
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
      <el-table-column prop="category" label="分类" />
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
    <edit-article ref="editArticleRef" @success="getArticleList" />
  </page-container>
</template>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 20px;
  
  :deep(.el-card__body) {
    padding: 20px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
  
  .search-select {
    width: 200px;
  }
}
</style>
