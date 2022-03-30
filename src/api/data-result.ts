import { AxiosResponse } from "axios";

// HTTP 接口错误信息
export interface DataServiceError {
  message: string;
}

// HTTP 接口响应标准数据格式
// @ts-ignore
export interface DataServiceResult<T> extends AxiosResponse<T> {
  error?: DataServiceError;
  data?: any;
  success?: boolean;
}
