import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user/login',
      name: 'loginPage',
      component: () => import('@/views/login/LoginPage.vue'),
    },
    {
      path: '/',
      name: 'layoutContainer',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article',
      children: [
        {
          path: '/article/category',
          name: 'articleCategory',
          component: () => import('@/views/article/ArticleCategory.vue'),
        },
        {
          path: '/article',
          name: 'articleManage',
          component: () => import('@/views/article/ArticleManage.vue'),
        },
        {
          path: '/user/userInfo',
          name: 'userProfile',
          component: () => import('@/views/user/UserProfile.vue'),
        },
        {
          path: '/user/updateAvatar',
          name: 'userAvatar',
          component: () => import('@/views/user/UserAvatar.vue'),
        },
        {
          path: '/user/updatePwd',
          name: 'userPassword',
          component: () => import('@/views/user/UserPassword.vue'),
        },
      ],
    },
  ],
})

export default router
