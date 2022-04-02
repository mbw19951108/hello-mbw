<template>
  <div class="container">
    <a-breadcrumb class="container__breadcrumb">
      <a-breadcrumb-item>全部文章</a-breadcrumb-item>
      <a-breadcrumb-item :key="item.name"
                         v-for="item in breadcrumbList">{{item.name}}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-layout class="container__layout">
      <a-layout-sider width="200"
                      class="container__layout__sider">
        <a-menu class="container__layout__sider__menu"
                mode="inline">
          <a-sub-menu :key="category._id"
                      v-for="category in categoryList">
            <template #title>
              <span>{{category.title}}</span>
            </template>
            <a-menu-item :key="child._id"
                         v-for="child in category.children"
                         @click="onSelectCategory(child._id, child.title, category.title)">
              <span>{{child.title}}</span>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout-content class="container__layout__content">
        <a-list class="container__layout__content__list"
                item-layout="vertical"
                :data-source="articleList">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <a @click="onSelectArticle(item._id, item.title)">{{ item.title }}</a>
                </template>
              </a-list-item-meta>
              <template #actions>
                <div>
                  <calendar-outlined />
                  <span class="container__layout__content__extra">{{ moment(item.created_time).format("YYYY-MM-DD") }}</span>
                </div>
                <div>
                  <eye-outlined />
                  <span class="container__layout__content__extra">{{ item.click_count }}</span>
                </div>
              </template>
            </a-list-item>
          </template>
          <template #loadMore>
            <div class="container__layout__more">
              <span class="container__layout__more__text">每页{{pageSize}}条，共{{total}}条</span>
              <a-pagination v-model:current="pageNo"
                            :total="total"
                            show-less-items
                            @change="onPageChange(pageNo)" />
            </div>
          </template>
        </a-list>
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  Layout,
  Menu,
  Breadcrumb,
  message,
  List,
  Pagination,
} from "ant-design-vue";
import { EyeOutlined, CalendarOutlined } from "@ant-design/icons-vue";
import { ArticleService, CategoryService } from "@/api";
import { CategoryModel, ArticleModel, PageQueryModel } from "@/api/models";
import moment from "moment";

export default defineComponent({
  components: {
    [Layout.name]: Layout,
    [Layout.Header.name]: Layout.Header,
    [Layout.Content.name]: Layout.Content,
    [Layout.Sider.name]: Layout.Sider,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu,
    [Breadcrumb.name]: Breadcrumb,
    [Breadcrumb.Item.name]: Breadcrumb.Item,
    [List.name]: List,
    [List.Item.name]: List.Item,
    [List.Item.Meta.name]: List.Item.Meta,
    [Pagination.name]: Pagination,
    EyeOutlined,
    CalendarOutlined,
  },
  setup() {
    const pageNo = ref<number>(1);
    const pageSize = ref<number>(10);
    const total = ref<number>(0);
    const loading = ref<boolean>(false);
    const selectCategoryId = ref<string>();
    const selectArticleId = ref<string>();
    // 面包屑
    const breadcrumbList = ref<{ name: string; path?: string }[]>([]);
    // 分类列表
    const categoryList = ref<CategoryModel[]>([]);
    // 文章列表
    const articleList = ref<ArticleModel[]>([]);
    // 文章详情
    const articleDetail = ref<ArticleModel>();
    onMounted(() => {
      searchCategories();
      searchArticles();
    });
    // 获取分类
    const searchCategories = async () => {
      try {
        const { data } = await CategoryService.search();
        categoryList.value = data;
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // 选择分类
    const onSelectCategory = async (
      categoryId: string,
      categoryTitle: string,
      parentTitle: string
    ) => {
      if (selectCategoryId.value === categoryId) {
        return;
      }
      breadcrumbList.value = [
        {
          name: parentTitle,
        },
        {
          name: categoryTitle,
        },
      ];
      selectCategoryId.value = categoryId;
      selectArticleId.value = "";
      pageNo.value = 1;
      searchArticles(categoryId);
    };
    // 获取文章
    const searchArticles = async (
      categoryId?: string,
      query?: PageQueryModel
    ) => {
      try {
        loading.value = true;
        let result;
        if (categoryId) {
          result = await ArticleService.searchByCategoryId(categoryId, query);
        } else {
          result = await ArticleService.search(query);
        }
        articleList.value = result.data;
        total.value = result.meta!.total;
        loading.value = false;
      } catch (error: any) {
        loading.value = false;
        message.error(error.message);
      }
    };
    // 选择文章
    const onSelectArticle = async (articleId: string, articleTitle: string) => {
      if (selectArticleId.value === articleId) {
        return;
      }
      if (selectArticleId.value) {
        breadcrumbList.value.splice(breadcrumbList.value.length - 1, 1, {
          name: articleTitle,
        });
      } else {
        breadcrumbList.value.push({ name: articleTitle });
      }

      selectArticleId.value = articleId;
      getArticleDetail(articleId);
    };
    // 获取文章详情
    const getArticleDetail = async (articleId: string) => {
      try {
        const { data } = await ArticleService.detail(articleId);
        articleDetail.value = data;
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // 分页改变
    const onPageChange = (newPageNo: number) => {
      pageNo.value = newPageNo;
      searchArticles(selectCategoryId.value || "", {
        pageNo: pageNo.value,
        pageSize: pageSize.value,
      });
    };
    return {
      loading,
      total,
      pageNo,
      pageSize,
      categoryList,
      articleList,
      articleDetail,
      selectCategoryId,
      selectArticleId,
      moment,
      breadcrumbList,
      onSelectCategory,
      onSelectArticle,
      onPageChange,
    };
  },
});
</script>
<style lang="less" scoped>
@import "~ant-design-vue/lib/style/themes/default.less";

.container {
  padding: 0 50px;
  height: 100%;
  overflow: auto;
  &__breadcrumb {
    margin: 16px 0;
  }
  &__layout {
    height: calc(100% - 108px);
    padding: 24px 0;
    background: #fff;
    &__sider {
      background: #fff;
      &__menu {
        height: 100%;
      }
    }
    &__content {
      padding: 0 24px;
      min-height: 280px;
      &__list {
        height: 100%;
        overflow: auto;
      }
      &__extra {
        margin-left: 8px;
      }
    }
    &__more {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 0;
      &__text {
        margin-right: 10px;
      }
    }
  }

  ::v-deep .ant-list-item-meta-title,
  .ant-list-item-meta {
    margin-bottom: 0;
  }

  ::v-deep .ant-list-item-action {
    margin-top: 3px;
  }
}
</style>
