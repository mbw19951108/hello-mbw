import { RouteRecordRaw } from "vue-router";
import authGuard from "./guards/auth.guard";

export const menuRoutes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: { name: "Articles" },
  },
  {
    path: "/blog",
    name: "Blog",
    component: () => import("@/views/blog/blog.vue"),
    meta: { title: "博客", icon: "bulb-outlined" },
    children: [
      {
        path: "",
        redirect: { name: "Articles" },
      },
      {
        name: "Articles",
        path: "articles",
        component: () => import("@/views/blog/article-list.vue"),
      },
      {
        name: "CategoryArticles",
        path: ":categoryId/articles",
        component: () => import("@/views/blog/article-list.vue"),
      },
      {
        name: "ArticleDetail",
        path: "article/:articleId",
        component: () => import("@/views/blog/article-detail.vue"),
      },
      {
        name: "CategoryArticleDetail",
        path: ":categoryId/article/:articleId",
        component: () => import("@/views/blog/article-detail.vue"),
      },
    ],
  },
  {
    path: "/photography",
    name: "Photography",
    component: () => import("@/views/photography/photography.vue"),
    meta: { title: "摄影", icon: "camera-outlined" },
  },
  {
    path: "/charts",
    name: "Charts",
    component: () => import("@/views/charts/charts.vue"),
    meta: { title: "Charts", icon: "dashboard-outlined" },
  },
];

export const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: { name: "ArticleManagement" },
  },
  {
    name: "ArticleManagement",
    path: "article-management",
    component: () =>
      import("@/views/admin/article-management/article-management.vue"),
    meta: { title: "文章管理" },
  },
  {
    name: "PhotographyManagement",
    path: "photography-management",
    component: () =>
      import("@/views/admin/photography-management/photography-management.vue"),
    meta: { title: "摄影管理" },
  },
];

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/login.vue"),
    meta: { title: "用户登录" },
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/views/admin/admin.vue"),
    beforeEnter: [authGuard],
    children: adminRoutes,
  },
  {
    path: "/",
    name: "Menu",
    component: () => import("@/views/layout/layout.vue"),
    children: menuRoutes,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "Blog" },
  },
];
