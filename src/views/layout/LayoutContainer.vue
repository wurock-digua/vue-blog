<script setup>
import { CaretBottom } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/modules/user';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import avatar from '@/assets/default.png';

// 获取用户信息
const userStore = useUserStore();
onMounted(() => {
  userStore.getUser();
});
const router = useRouter();

const handleCommand = async (command) => {
  if (command === 'logout') {
    await ElMessageBox.confirm('是否确认退出登录？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    userStore.removeToken();
    userStore.setUser({});
    router.push('/user/login');
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
    background-color: #333;
    border-right: 1px solid #e6e6e6;
    width: 200px !important;

    .layout-title {
      text-align: center;
      margin: 20px 0;
      font-size: 20px;
      color: #fff;
      font-weight: 500;
    }

    .el-menu {
      border-right: none;
      background-color: transparent;

      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        color: rgba(255, 255, 255, 0.8);
        border-radius: 0;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        &.is-active {
          background-color: #409eff;
          color: #fff !important;
        }
      }

      :deep(.el-sub-menu) {
        .el-menu {
          background-color: #333 !important;

          .el-menu-item {
            background-color: transparent !important;

            &.is-active {
              background-color: #409eff !important;
            }
          }
        }
      }
    }
  }

  .el-header {
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    color: #333;
    height: 60px;

    >span {
      font-weight: 400;
      font-size: 14px;
      color: #333;
    }
  }

  .el-main {
    background-color: #f5f5f5;
    padding: 20px;
    min-height: calc(100vh - 120px);
  }

  .el-footer {
    background-color: #fff;
    border-top: 1px solid #e6e6e6;
    text-align: center;
    color: #666;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
  }

  .el-dropdown_box {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f5f5f5;
    }

    .el-avatar {
      margin-right: 10px;
      border: 1px solid #eee;
    }

    .el-icon {
      font-size: 14px;
      color: #333;
    }
  }

  :deep(.el-dropdown-menu) {
    background-color: #fff;
    border: 1px solid #e6e6e6;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 5px 0;

    .el-dropdown-item {
      color: #333;
      padding: 8px 15px;
      transition: background-color 0.2s;

      &:not(.is-disabled):hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
