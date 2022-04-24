import http from "./http-client";
import { ArticleCreateBody, ArticleUpdateBody, ArticleQueryModel } from "./models";
import * as qs from "qs";

export const ArticleService = {
  search: (query?: ArticleQueryModel) =>
    http.get(`/articles?${qs.stringify(query)}`),
  create: (body: ArticleCreateBody) => http.post(`/article`, body),
  detail: (articleId: string) => http.get(`/article/${articleId}`),
  update: (articleId: string, body: ArticleUpdateBody) =>
    http.put(`/article/${articleId}`, body),
  delete: (articleId: string) => http.delete(`/article/${articleId}`),
  publish: (articleId: string) => http.put(`/article/${articleId}/publish`),
  unpublish: (articleId: string) =>
    http.put(`/article/${articleId}/unpublish`),
};
