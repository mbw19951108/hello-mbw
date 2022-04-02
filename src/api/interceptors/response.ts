import { AxiosResponse } from "axios";

export function responseHandler(
  response: AxiosResponse
): AxiosResponse | Promise<AxiosResponse> {
  const body = response.data;
  const data = (body || {}).data || {};
  const token = data.token || "";
  if (token) {
    localStorage.setItem("token", token);
  }
  return body;
}
