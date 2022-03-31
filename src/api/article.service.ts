import http from "./http-client";
import { ArticleCreateBody, ArticleUpdateBody, PageQueryModel } from "./models";
import * as qs from "qs";

export const ArticleService = {
  create: (body: ArticleCreateBody) => http.post(`/article`, body),
  search: (categoryId: string, query?: PageQueryModel) =>
    http.get(`/category/${categoryId}/article?${qs.stringify(query)}`),
  detail: (categoryId: string, articleId: string) =>
    http.get(`/category/${categoryId}/article/${articleId}`),
  update: (categoryId: string, articleId: string, body: ArticleUpdateBody) =>
    http.patch(`/category/${categoryId}/article/${articleId}`, body),
  delete: (categoryId: string, articleId: string) =>
    http.delete(`/category/${categoryId}/article/${articleId}`),
  publish: (categoryId: string, articleId: string) =>
    http.patch(`/category/${categoryId}/article/${articleId}/publish`),
  unpublish: (categoryId: string, articleId: string) =>
    http.patch(`/category/${categoryId}/article/${articleId}/unpublish`),
};
