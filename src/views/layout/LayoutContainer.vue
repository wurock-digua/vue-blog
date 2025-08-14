<script setup>
import { CaretBottom } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/modules/user';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 获取用户信息
const userStore = useUserStore();
onMounted(() => {
  userStore.getUser();
});
const router = useRouter();
const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.removeToken();
    userStore.setUser({});
    router.push('/login');
  } else {
    // 跳转
    router.push(`/user/${command}`);
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside>
      <h2 class="layout-title">Rock-Blog</h2>
      <el-menu :default-active="$route.path" :router="true">
        <el-menu-item index="/article/category">
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/userInfo">基本资料</el-menu-item>
          <el-menu-item index="/user/updateAvatar">更换头像</el-menu-item>
          <el-menu-item index="/user/updatePwd">重置密码</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <span>用户名：{{ userStore.user.nickname || userStore.user.username }}</span>

        <el-dropdown placeholder="bottom-end" @command="handleCommand">
          <!-- 展示给用户看的 -->
          <span class="el-dropdown_box">
            <el-avatar :src="userStore.user.userPic || avatar"></el-avatar>
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>

          <!-- 下拉菜单 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="userInfo">基本资料</el-dropdown-item>
              <el-dropdown-item command="updateAvatar">更换头像</el-dropdown-item>
              <el-dropdown-item command="updatePwd">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <span>Rock-Blog@2025</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-right: none;
    width: 220px !important;
    transition: all 0.3s ease;

    .layout-title {
      text-align: center;
      margin: 28px 0;
      font-size: 26px;
      color: #ffffff;
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      font-weight: 700;
      letter-spacing: 1px;
    }

    .el-menu {
      border-right: none;
      background-color: transparent;
      margin-top: 20px;

      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        color: rgba(255, 255, 255, 0.85);
        border-radius: 0;
        margin: 5px 0;
        transition: all 0.3s ease;

        &:hover {
          background-color: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        &.is-active {
          background-color: rgba(255, 255, 255, 0.25);
          color: #ffffff !important;
          border-left: 4px solid rgba(255, 255, 255, 0.7);
        }
      }

      :deep(.el-sub-menu) {
        .el-menu {
          background-color: rgba(0, 0, 0, 0.1) !important;

          .el-menu-item {
            background-color: transparent !important;

            &.is-active {
              background-color: rgba(255, 255, 255, 0.2) !important;
            }
          }
        }
      }
    }
  }

  .el-header {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 25px;
    color: #333333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    height: 65px;

    >span {
      font-weight: 500;
      font-size: 16px;
      color: #495057;
    }
  }

  .el-main {
    background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
    padding: 25px;
    min-height: calc(100vh - 130px);
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(102, 126, 234, 0.3);
      border-radius: 3px;
    }
  }

  .el-footer {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-top: 1px solid #e6e6e6;
    text-align: center;
    color: #666666;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
    height: 65px;
  }

  .el-dropdown_box {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 15px;
    border-radius: 30px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .el-avatar {
      margin-right: 12px;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .el-icon {
      font-size: 16px;
      transition: transform 0.3s ease;
      color: #495057;
    }

    &:hover {
      .el-icon {
        transform: rotate(180deg);
      }
    }
  }

  :deep(.el-dropdown-menu) {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid #e6e6e6;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 8px 0;

    .el-dropdown-item {
      color: #495057;
      padding: 10px 20px;
      transition: all 0.2s ease;

      &:not(.is-disabled):hover {
        background-color: rgba(102, 126, 234, 0.1);
        color: #667eea;
      }
    }
  }
}
</style>
