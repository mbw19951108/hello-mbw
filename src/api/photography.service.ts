import http from "./http-client";
import { PageQueryModel, PhotographyCreateBody } from "./models";
import * as qs from "qs";

export const PhotographyService = {
  search: (query?: PageQueryModel) =>
    http.get(`/photography?${qs.stringify(query)}`),
  create: (body: PhotographyCreateBody) => http.post(`/photography`, body),
  delete: (photographyId: string) =>
    http.delete(`/photography/${photographyId}`),
};
