import router from "@/router";

export function commonErrorHandler(error: any) {
  if (error?.response?.status === 401) {
    localStorage.removeItem("token");
    router.replace("/login");
  }
  const errorBody = {
    message: error?.response?.data?.message || "",
    code: error?.response?.status || "",
  };
  return Promise.reject(errorBody);
}
