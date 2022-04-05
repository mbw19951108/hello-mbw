import http from "./http-client";

export const FileService = {
  upload: (body: any) => http.post(`/upload`, body),
  uploadPhoto: (body: any) => http.post(`/photo`, body),
};
