import { AxiosRequestConfig } from "axios";

export function requestHandler(
  config: AxiosRequestConfig
): AxiosRequestConfig | Promise<AxiosRequestConfig> {
  return config;
}
