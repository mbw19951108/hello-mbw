import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export default async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  if (localStorage.getItem("token")) {
    return next();
  } else {
    localStorage.clear();
    return next("/login");
  }
}
