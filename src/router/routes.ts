import { RouteRecordRaw } from "vue-router";
import authGuard from "./guards/auth.guard";

export const menuRoutes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: { name: "Development" },
  },
  {
    path: "/development",
    name: "Development",
    component: () => import("@/views/development/development.vue"),
    meta: { title: "开发", icon: "bulb-outlined" },
    children: [
      {
        path: "",
        component: () => import("@/views/development/article-list.vue"),
      },
      {
        name: "Articles",
        path: ":categoryId/articles",
        component: () => import("@/views/development/article-list.vue"),
      },
      {
        name: "CategoryArticleDetail",
        path: ":categoryId/article/:articleId",
        component: () => import("@/views/development/article-detail.vue"),
      },
      {
        name: "ArticleDetail",
        path: "article/:articleId",
        component: () => import("@/views/development/article-detail.vue"),
      },
    ],
  },
  {
    path: "/photography",
    name: "Photography",
    component: () => import("@/views/photography/Photography.vue"),
    meta: { title: "摄影", icon: "camera-outlined" },
  },
  {
    path: "/charts",
    name: "Charts",
    component: () => import("@/views/charts/Charts.vue"),
    meta: { title: "Charts", icon: "dashboard-outlined" },
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
    meta: { title: "后台管理" },
    beforeEnter: [authGuard],
  },
  {
    path: "/",
    name: "Menu",
    component: () => import("@/views/layout/Layout.vue"),
    children: menuRoutes,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "Development" },
  },
];
