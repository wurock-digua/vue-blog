<script setup>
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import SelectArticleCategory from './SelectArticleCategory.vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { articleEditService, articleAddService, articleGetDetailService } from '@/api/article'

const formModel = ref({
  title: '',
  content: '',
  coverImg: '',
  state: '',
  categoryId: ''
});

// 控制抽屉的显示与隐藏
const visibleDrawer = ref(false);
const editorRef = ref();
const open = async (row) => {
  visibleDrawer.value = true; // 打开抽屉
  if (row.id) {
    // 如果传入了row，表示编辑文章
    const res = await articleGetDetailService(row.id); // 获取文章详情,进行回显
    formModel.value = res.data.data;
  } else {
    // 新增文章时，清空formModel
    formModel.value = {
      title: '',
      content: '',
      coverImg: '',
      state: '',
      categoryId: ''
    };
    imgUrl.value = '';
    editorRef.value.setHtml('');
  }
};
defineExpose({
  open
});

// 图片上传相关
const imgUrl = ref('');
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw); //图片预览
  formModel.value.coverImg = uploadFile.raw;
}

// 表单提交
const emit = defineEmits(['success']);
const onPublish = async (state) => {
  formModel.value.state = state;
  if (formModel.value.id) {
    // 编辑文章逻辑
    await articleEditService(formModel.value);
    visibleDrawer.value = false; // 关闭抽屉
    emit('success', 'edit');
  } else {
    // 新增文章逻辑
    await articleAddService(formModel.value);
    visibleDrawer.value = false; // 关闭抽屉
    emit('success', 'add');
  }
};
</script>

<template>
  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑文章' : '新增文章'" direction="rtl">
    <el-form :model="formModel">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="文章分类" prop="categoryId">
        <select-article-category v-model="formModel.categoryId" />
      </el-form-item>

      <el-form-item label="文章封面" prop="coverImg">
        <el-upload class="avatar-upload" :show-file-list="false" :auto-upload="false" :on-change="onSelectFile">
          <img v-if="formModel.coverImg" :src="formModel.coverImg" alt="">
          <el-icon v-else class="avatar-upload-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor ref="editorRef" theme="snow" v-model:content="formModel.content" contentType="html">
          </quill-editor>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>

  </el-drawer>
</template>
