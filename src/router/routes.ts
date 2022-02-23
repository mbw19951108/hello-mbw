import { RouteRecordRaw } from "vue-router";

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
    path: "/",
    name: "Menu",
    component: () => import("@/views/layout/Layout.vue"),
    children: menuRoutes,
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "404" },
  },
];
