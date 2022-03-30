import http from "./http-client";

export const FileService = {
  upload(body: any) {
    return http.post(`/upload`, body);
  },
};
