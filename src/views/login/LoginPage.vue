<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import { userLoginService, userRegisterService } from '@/api/user';
import { useUserStore } from '@/stores/modules/user';

// 表单引用
const formRef = ref();
const isRegister = ref(false); // 控制显示注册或登录表单
const rememberMe = ref(false); // 记住我功能

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

// 页面加载时检查是否保存了登录信息
onMounted(() => {
  const savedLoginInfo = localStorage.getItem('loginInfo');
  if (savedLoginInfo) {
    const { username, password } = JSON.parse(savedLoginInfo);
    formModel.value.username = username;
    formModel.value.password = password;
    rememberMe.value = true;
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
      // 处理记住我功能
      if (rememberMe.value) {
        // 保存登录信息到localStorage
        const loginInfo = {
          username: formModel.value.username,
          password: formModel.value.password
        };
        localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
      } else {
        // 清除保存的登录信息
        localStorage.removeItem('loginInfo');
      }
      
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
  <div class="login-background">
    <div class="login-container">
      <div class="login-box">
        <!-- 注册相关表单 -->
        <el-form v-if="isRegister" ref="formRef" :model="formModel" :rules="rules" class="login-form">
          <h1 class="form-title">注册</h1>

          <el-form-item prop="username">
            <el-input v-model="formModel.username" placeholder="请输入用户名" size="large" clearable></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="formModel.password" type="password" placeholder="请输入密码" size="large"
              show-password></el-input>
          </el-form-item>

          <el-form-item prop="repassword">
            <el-input v-model="formModel.repassword" type="password" placeholder="请确认密码" size="large"
              show-password></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="large" @click="onRegister" class="submit-btn">注册</el-button>
          </el-form-item>

          <el-form-item class="form-footer">
            <el-link :underline="false" @click="isRegister = false">已有账号？去登录</el-link>
          </el-form-item>
        </el-form>

        <!-- 登录相关表单 -->
        <el-form v-else ref="formRef" :model="formModel" :rules="rules" class="login-form">
          <h1 class="form-title">登录</h1>

          <el-form-item prop="username">
            <el-input v-model="formModel.username" placeholder="请输入用户名" size="large" clearable></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="formModel.password" type="password" placeholder="请输入密码" size="large"
              show-password></el-input>
          </el-form-item>

          <el-form-item class="form-options">
            <div class="options-container">
              <el-checkbox v-model="rememberMe" class="remember-checkbox">记住我</el-checkbox>
              <el-link :underline="false" class="forgot-link">忘记密码？</el-link>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="large" @click="onLogin" class="submit-btn">登录</el-button>
          </el-form-item>

          <el-form-item class="form-footer">
            <el-link :underline="false" @click="isRegister = true">没有账号？去注册</el-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-background {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-container {
    width: 100%;
    max-width: 400px;
    padding: 0 20px;

    .login-box {
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 30px;

      .form-title {
        text-align: center;
        margin: 0 0 20px;
        font-size: 24px;
        font-weight: 500;
        color: #333;
      }

      .login-form {
        :deep(.el-form-item) {
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 0;
          }

          .el-form-item__content {
            display: flex;
            flex-direction: column;
          }

          :deep(.el-input__wrapper) {
            border-radius: 4px;
            box-shadow: 0 0 0 1px #dcdfe6 inset;
            
            &.is-focus {
              box-shadow: 0 0 0 1px #409eff inset;
            }
          }

          :deep(.el-input__inner) {
            height: 40px;
            font-size: 14px;
            padding: 0 15px;
            color: #333;
          }
        }

        .form-options {
          margin-bottom: 25px;

          :deep(.el-form-item__content) {
            flex-direction: row;
          }

          .options-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .remember-checkbox {
            :deep(.el-checkbox__label) {
              color: #666;
              font-weight: 400;
            }
          }

          .forgot-link {
            color: #409eff;
            font-weight: 400;
            transition: color 0.3s;

            &:hover {
              color: #333;
              text-decoration: none;
            }
          }
        }

        .submit-btn {
          width: 100%;
          height: 40px;
          font-size: 14px;
          border-radius: 4px;
          background-color: #409eff;
          border: none;
          color: white;
          transition: background-color 0.3s;

          &:hover {
            background-color: #66b1ff;
          }

          &:active {
            background-color: #337ecc;
          }
        }

        .form-footer {
          text-align: center;
          margin-top: 20px;

          :deep(.el-link) {
            color: #409eff;
            font-weight: 400;
            font-size: 14px;
            transition: color 0.3s;

            &:hover {
              color: #333;
              text-decoration: none;
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-background {
    .login-container {
      .login-box {
        padding: 20px;
        margin: 0 15px;

        .form-title {
          font-size: 22px;
          margin-bottom: 15px;
        }

        .login-form {
          :deep(.el-input__inner) {
            height: 38px;
            font-size: 14px;
          }

          .submit-btn {
            height: 38px;
            font-size: 14px;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .login-background {
    .login-container {
      padding: 0 15px;

      .login-box {
        padding: 20px;

        .form-title {
          font-size: 20px;
          margin-bottom: 15px;
        }
      }
    }
  }
}
</style>
