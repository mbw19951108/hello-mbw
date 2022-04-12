import http from "./http-client";
import { CategoryCreateBody, CategoryUpdateBody } from "./models";

export const CategoryService = {
  search: () => http.get(`/category`),
  create: (body: CategoryCreateBody) => http.post(`/category`, body),
  update: (categoryId: string, body: CategoryUpdateBody) =>
    http.put(`/category/${categoryId}`, body),
  delete: (categoryId: string) => http.delete(`/category/${categoryId}`),
};
