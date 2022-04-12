import axios, { AxiosRequestConfig } from "axios";
import { DataServiceResult } from "./data-result";
import {
  commonErrorHandler,
  requestHandler,
  responseHandler,
} from "./interceptors";

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: false, // 跨域请求时发送 cookies
  timeout: 10000,
});

// 接口请求拦截器
http.interceptors.request.use(requestHandler, commonErrorHandler);
http.interceptors.response.use(responseHandler, commonErrorHandler);

export default {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return http.get<T>(url, config) as Promise<DataServiceResult<T>>;
  },
  post<T>(url: string, data: any, config?: AxiosRequestConfig) {
    return http.post<T>(url, data, config) as Promise<DataServiceResult<T>>;
  },
  put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return http.put<T>(url, data, config) as Promise<DataServiceResult<T>>;
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return http.delete<T>(url, config) as Promise<DataServiceResult<T>>;
  },
};
