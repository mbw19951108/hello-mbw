<template>
  <a-list class="list" item-layout="vertical" :data-source="articleList">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta>
          <template #title>
            <a @click="onSelectArticle(item._id)">{{ item.title }}</a>
          </template>
        </a-list-item-meta>
        <template #actions>
          <div>
            <calendar-outlined />
            <span class="list__extra">{{ moment(item.created_time).format("YYYY-MM-DD") }}</span>
          </div>
          <div>
            <eye-outlined />
            <span class="list__extra">{{ item.click_count }}</span>
          </div>
        </template>
      </a-list-item>
    </template>
    <template #loadMore>
      <div class="list__more">
        <span class="list__more__text">每页{{ meta.pageSize }}条，共{{ meta.total }}条</span>
        <a-pagination v-model:current="meta.pageNo" :total="meta.total" show-less-items
          @change="onPageChange($event)" />
      </div>
    </template>
  </a-list>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { message, List, Pagination } from "ant-design-vue";
import { EyeOutlined, CalendarOutlined } from "@ant-design/icons-vue";
import { ArticleService } from "@/api";
import { ArticleModel, MetaModel } from "@/api/models";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
export default defineComponent({
  components: {
    [List.name]: List,
    [List.Item.name]: List.Item,
    [List.Item.Meta.name]: List.Item.Meta,
    [Pagination.name]: Pagination,
    EyeOutlined,
    CalendarOutlined,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    let loading = ref(false);
    // 文章列表
    let articleList = ref<ArticleModel[]>([]);
    // 分页数据
    let meta = ref({});
    watch(
      () => route,
      () => searchArticles()
    );
    onMounted(() => searchArticles());
    // 获取文章
    const searchArticles = async () => {
      const categoryId = route.params.categoryId as string;
      const query = { ...route.query };
      try {
        loading.value = true;
        let result;
        if (categoryId) {
          result = await ArticleService.searchByCategoryId(categoryId, query);
        } else {
          result = await ArticleService.search(query);
        }
        articleList.value = result.data;
        meta.value = result.meta!;
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    // 选择文章
    const onSelectArticle = (articleId: string) => {
      const categoryId = route.params.categoryId as string;
      if (categoryId) {
        router.push({
          name: "CategoryArticleDetail",
          params: { articleId, categoryId },
        });
      } else {
        router.push({
          name: "ArticleDetail",
          params: { articleId },
        });
      }
    };
    // 分页改变
    const onPageChange = (pageNo: number) => {
      const query = {
        ...route.query,
        pageNo,
      };
      if (pageNo === 1) delete Object.assign(query).pageNo;
      router.push({ query });
    };
    return {
      loading,
      meta,
      articleList,
      moment,
      onSelectArticle,
      onPageChange,
    };
  },
});
</script>
<style lang="less" scoped>
.list {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 24px;
    flex-shrink: 0;

    &__text {
      margin-right: 10px;
    }
  }

  &__extra {
    margin-left: 8px;
  }

  ::v-deep .ant-spin-nested-loading {
    overflow: auto;
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
