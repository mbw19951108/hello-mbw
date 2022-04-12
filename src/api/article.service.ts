import http from "./http-client";
import { ArticleCreateBody, ArticleUpdateBody, PageQueryModel } from "./models";
import * as qs from "qs";

interface articlePageQueryModel extends PageQueryModel {
  showAll?: boolean; // 是否展示未发布文章
  pageable?: number; // 是否启用分页查询（仅限后台管理页面使用）
}

export const ArticleService = {
  search: (query?: articlePageQueryModel) =>
    http.get(`/article?${qs.stringify(query)}`),
  create: (body: ArticleCreateBody) => http.post(`/article`, body),
  detail: (articleId: string) => http.get(`/article/${articleId}`),
  update: (articleId: string, body: ArticleUpdateBody) =>
    http.put(`/article/${articleId}`, body),
  delete: (articleId: string) => http.delete(`/article/${articleId}`),
  publish: (articleId: string) => http.put(`/article/${articleId}/publish`),
  unpublish: (articleId: string) =>
    http.put(`/article/${articleId}/unpublish`),
  searchByCategoryId: (categoryId: string, query?: articlePageQueryModel) =>
    http.get(`/category/${categoryId}/article?${qs.stringify(query)}`),
};
