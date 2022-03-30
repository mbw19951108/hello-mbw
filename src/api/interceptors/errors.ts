export function commonErrorHandler(error: any) {
  const errorBody = {
    message: error?.response?.data?.message || "",
    code: error?.response?.status || "",
  };
  return Promise.reject(errorBody);
}
