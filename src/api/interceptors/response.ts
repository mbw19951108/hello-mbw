import { AxiosResponse } from "axios";

export function responseHandler(
  response: AxiosResponse
): AxiosResponse | Promise<AxiosResponse> {
  const body = response.data;
  return body;
}
