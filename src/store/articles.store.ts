import { ArticleService } from '@/api';
import { ArticleModel, ArticleQueryModel } from '@/api/models';
import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';
export const ArticlesStore = defineStore('articles', {
  state: () => {
    return {
      items: [] as ArticleModel[],
      meta: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      detail: {} as ArticleModel | null,
      loaded: false,
      loading: true
    }
  },
  actions: {
    async getItems(query: ArticleQueryModel) {
      try {
        this.loading = true;
        const result = await ArticleService.search(query);
        this.items = result.data;
        this.meta = result.meta!;
        this.loading = false;
        this.loaded = true;
      } catch (error: any) {
        message.error(error.message);
        this.loading = false;
      }
    },
    async getDetail(articleId: string) {
      this.detail = null;
      try {
        this.loading = true;
        const { data } = await ArticleService.detail(articleId);
        this.detail = data;
        this.loading = false;
      } catch (error: any) {
        message.error(error.message);
        this.loading = false;
      }
    }
  }
})