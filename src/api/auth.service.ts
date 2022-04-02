import http from "./http-client";

export interface LoginBody {
  username: string;
  password: string;
  verify: string;
}

export const AuthService = {
  login: (body: LoginBody) => http.post(`/login`, body),
  captcha: () => http.get(`/captcha`),
};
