<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import { userLoginService, userRegisterService } from '@/api/user';
import { useUserStore } from '@/stores/modules/user';

// 表单引用
const formRef = ref();
const isRegister = ref(false); // 控制显示注册或登录表单

// 表单数据模型
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
    { pattern: /^\S{5,10}$/, message: '用户名长度需为5-10位非空字符', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
    { pattern: /^\S{6,15}$/, message: '密码长度需为6-15位非空字符', trigger: ['blur', 'change'] }
  ],
  repassword: [
    { required: true, message: '请确认密码', trigger: ['blur', 'change'] },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change']
    }
  ]
}

// 切换登录注册页面时重置表单
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

// 注册方法
const onRegister = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      // 这里可以使用 await 调用注册接口
      const res = await userRegisterService(formModel.value)
      if (res.data.code === 0) {
        // 注册成功逻辑
        console.log('注册成功', res.data);
        // 跳转到登录页面
        isRegister.value = false;
      } else {
        // 注册失败逻辑
        console.error('注册失败');
      }
    }
  });
};

// 登录方法
const router = useRouter()
const userStore = useUserStore()
const onLogin = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      // 这里可以使用 await 调用登录接口
      const res = await userLoginService(formModel.value)
      if (res.data.code === 0) {
        // 登录成功逻辑
        console.log('登录成功', res.data);
        // 将token存储到pinia
        userStore.setToken(res.data.data)
        // 将token存储到localStorage
        localStorage.setItem('token', res.data.data)
        // 跳转到首页
        router.push('/')
      } else {
        // 登录失败逻辑
        console.error('用户名或密码错误');
      }
    }
  });
};
</script>

<template>
  <el-row class="login-page">
    <el-col :span="6" class="form">
      <!-- 注册相关表单 -->
      <el-form v-if="isRegister" ref="formRef" :model="formModel" :rules="rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>

        <el-form-item prop="username">
          <el-input v-model="formModel.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="formModel.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item prop="repassword">
          <el-input v-model="formModel.repassword" placeholder="请确认密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onRegister">注册</el-button>
        </el-form-item>

        <el-form-item>
          <el-link :underlined="false">已有账号？去登录</el-link>
        </el-form-item>
      </el-form>

      <!-- 登录相关表单 -->
      <el-form v-else ref="formRef" :model="formModel" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>

        <el-form-item prop="username">
          <el-input v-model="formModel.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="formModel.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item class="form-item-flex">
          <el-checkbox class="remember-checkbox">记住我</el-checkbox>
          <el-link class="forgot-link" :underlined="false">忘记密码？</el-link>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onLogin">登录</el-button>
        </el-form-item>

        <el-form-item>
          <el-link :underlined="false">没有账号？去注册</el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4f8 0%, #c9e7fa 100%);
}

.form {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(60, 120, 180, 0.15);
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #409eff;
    margin-bottom: 24px;
    text-align: center;
  }

  .el-form-item {
    width: 100%;
    margin-bottom: 20px;
  }

  .form-item-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .remember-checkbox {
      margin-right: 32px;
    }

    .forgot-link {
      margin-left: auto;
    }
  }

  .el-input {
    font-size: 1rem;
    border-radius: 8px;
  }

  .el-button {
    width: 100%;
    border-radius: 8px;
    font-size: 1.1rem;
    padding: 12px 0;
    background: linear-gradient(90deg, #409eff 60%, #67c23a 100%);
    color: #fff;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
    transition: background 0.3s;

    &:hover {
      background: linear-gradient(90deg, #67c23a 60%, #409eff 100%);
    }
  }

  .el-link {
    font-size: 0.95rem;
    color: #409eff;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #67c23a;
      text-decoration: underline;
    }
  }
}
</style>
