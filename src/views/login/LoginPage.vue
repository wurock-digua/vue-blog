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
              <el-checkbox class="remember-checkbox">记住我</el-checkbox>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="rgba(255,255,255,0.08)"/><circle cx="20" cy="20" r="5" fill="rgba(255,255,255,0.15)"/><circle cx="50" cy="50" r="8" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="3" fill="rgba(255,255,255,0.2)"/></svg>');
    background-size: cover;
    animation: float 12s ease-in-out infinite;
  }

  .login-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    padding: 0 25px;

    .login-box {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
      padding: 45px 40px;
      animation: slideUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);

      .form-title {
        text-align: center;
        margin: 0 0 35px;
        font-size: 34px;
        font-weight: 700;
        color: #495057;
        letter-spacing: 1px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .login-form {
        :deep(.el-form-item) {
          margin-bottom: 26px;

          &:last-child {
            margin-bottom: 0;
          }

          .el-form-item__content {
            display: flex;
            flex-direction: column;
          }

          :deep(.el-input__wrapper) {
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            background-color: #ffffff;

            &:hover {
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }

            &.is-focus {
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);
              border: 1px solid #667eea;
            }
          }

          :deep(.el-input__inner) {
            height: 50px;
            font-size: 16px;
            padding: 0 15px;
            color: #495057;
          }
        }

        .form-options {
          margin-bottom: 32px;

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
            :deep(.el-checkbox__input) {
              line-height: 1;
            }

            :deep(.el-checkbox__label) {
              color: #666;
              font-weight: 400;
            }
          }

          .forgot-link {
            color: #667eea;
            font-weight: 500;
            transition: all 0.3s ease;

            &:hover {
              color: #764ba2;
              text-decoration: none;
            }
          }
        }

        .submit-btn {
          width: 100%;
          height: 52px;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 1px;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
          text-transform: uppercase;

          &:hover {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.5);
          }

          &:active {
            transform: translateY(-1px);
          }
        }

        .form-footer {
          text-align: center;
          margin-top: 25px;

          :deep(.el-link) {
            color: #667eea;
            font-weight: 500;
            font-size: 16px;
            transition: all 0.3s ease;

            &:hover {
              color: #764ba2;
              text-decoration: none;
            }
          }
        }
      }
    }
  }
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-25px) rotate(5deg);
  }

  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-background {
    .login-container {
      .login-box {
        padding: 35px 25px;
        margin: 0 20px;
        border-radius: 10px;

        .form-title {
          font-size: 30px;
          margin-bottom: 30px;
        }

        .login-form {
          :deep(.el-input__inner) {
            height: 48px;
            font-size: 15px;
          }

          .submit-btn {
            height: 48px;
            font-size: 17px;
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
        padding: 30px 20px;

        .form-title {
          font-size: 26px;
          margin-bottom: 25px;
        }
      }
    }
  }
}
</style>
