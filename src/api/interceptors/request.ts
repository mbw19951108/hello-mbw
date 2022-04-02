import { AxiosRequestConfig } from "axios";

export function requestHandler(
  config: AxiosRequestConfig
): AxiosRequestConfig | Promise<AxiosRequestConfig> {
  const token = localStorage.getItem("token");
  if (config && config.headers && token) {
    config.headers["Token"] = `${token}`;
  }
  return config;
}
