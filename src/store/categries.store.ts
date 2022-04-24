import { CategoryService } from '@/api';
import { CategoryModel } from '@/api/models';
import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';
export const CategoriesStore = defineStore('categories', {
  state: () => {
    return {
      items: [] as CategoryModel[],
      loaded: false,
      loading: true
    }
  },
  actions: {
    async getItems() {
      try {
        this.loading = true;
        const { data } = await CategoryService.search();
        this.items = data;
        this.loading = false;
        this.loaded = true;
      } catch (error: any) {
        message.error(error.message);
        this.loading = false;
      }
    },
  }
})