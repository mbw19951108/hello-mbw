import { RouteRecordRaw } from "vue-router";
import authGuard from "./guards/auth.guard";

export const menuRoutes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: { name: "Personal" },
  },
  {
    path: "/personal",
    name: "Personal",
    component: () => import("@/views/personal/Personal.vue"),
    meta: { title: "历程" },
  },
  {
    path: "/work",
    name: "Work",
    component: () => import("@/views/work/Work.vue"),
    meta: { title: "历程" },
  },
  {
    path: "/photography",
    name: "Photography",
    component: () => import("@/views/photography/Photography.vue"),
    meta: { title: "摄影" },
  },
  {
    path: "/charts",
    name: "Charts",
    component: () => import("@/views/charts/Charts.vue"),
    meta: { title: "大屏" },
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
    redirect: { name: "Personal" },
  },
];
