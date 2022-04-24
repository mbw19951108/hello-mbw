<template>
  <a-spin wrapperClassName="spin" :spinning="loaded && loading">
    <!-- 首次加载骨架屏占位 -->
    <a-skeleton :loading="!loaded" active v-for="index of 5" :key="index" />
    <a-list v-if="loaded" class="list" item-layout="vertical" :data-source="items">
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
  </a-spin>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { List, Pagination, Skeleton, Spin } from "ant-design-vue";
import { EyeOutlined, CalendarOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { ArticlesStore } from "@/store";
import { storeToRefs } from 'pinia'
import moment from "moment";

export default defineComponent({
  components: {
    [Skeleton.name]: Skeleton,
    [Spin.name]: Spin,
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
    const articlesStore = ArticlesStore();
    const { loaded, loading, items, meta } = storeToRefs(articlesStore);
    watch(
      () => route.query,
      () => articlesStore.getItems({ ...route.query })
    );
    onMounted(() => articlesStore.getItems({ ...route.query }));
    // 选择文章
    const onSelectArticle = (articleId: string) => {
      router.push({
        name: "ArticleDetail",
        params: { articleId },
        query: { categoryId: route.query.categoryId }
      });
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
      loaded,
      loading,
      meta,
      items,
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

  ::v-deep .ant-spin-nested-loading {
    overflow: auto;
  }

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

  ::v-deep .ant-list-item-meta-title,
  .ant-list-item-meta {
    margin-bottom: 0;
  }

  ::v-deep .ant-list-item-action {
    margin-top: 3px;
  }
}

.spin {
  height: 100%;

  ::v-deep .ant-spin-container {
    height: 100%;
  }

}
</style>
