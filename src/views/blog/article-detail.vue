<template>
  <div class="detail">
    <a-spin :spinning="loading">
      <a-page-header class="detail__header" :title="articleDetail?.title" @back="onBack()">
        <template #subTitle>
          <div class="detail__header__subTitle">
            <calendar-outlined />
            <span class="detail__header__subTitle__text">{{
              moment(articleDetail?.created_time).format("YYYY-MM-DD")
            }}</span>
          </div>
          <div class="detail__header__subTitle">
            <eye-outlined />
            <span class="detail__header__subTitle__text">{{ articleDetail?.click_count }}</span>
          </div>
        </template>
      </a-page-header>
    </a-spin>
    <div class="detail__content markdown-body" v-html="articleDetail?.content"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { message, PageHeader, Spin } from "ant-design-vue";
import { EyeOutlined, CalendarOutlined } from "@ant-design/icons-vue";
import { ArticleService } from "@/api";
import { ArticleModel } from "@/api/models";
import { useRoute } from "vue-router";
import mavonEditor from "mavon-editor";
import moment from "moment";
export default defineComponent({
  components: {
    [PageHeader.name]: PageHeader,
    [Spin.name]: Spin,
    EyeOutlined,
    CalendarOutlined,
    mavonEditor,
  },
  setup() {
    const route = useRoute();
    let loading = ref<boolean>(false);
    let articleDetail = ref<ArticleModel>();
    onMounted(() => getArticle());
    // 获取文章详情
    const getArticle = async () => {
      const articleId = route.params.articleId as string;
      try {
        loading.value = true;
        const { data } = await ArticleService.detail(articleId);
        articleDetail.value = data;
        loading.value = false;
      } catch (error: any) {
        loading.value = false;
        message.error(error.message);
      }
    };
    const onBack = () => history.back();
    return {
      loading,
      articleDetail,
      moment,
      onBack,
    };
  },
});
</script>
<style lang="less" scoped>
.detail {
  height: 100%;

  &__header {
    border-bottom: 1px solid rgb(235, 237, 240);

    &__subTitle {
      display: inline-block;
      margin-left: 15px;

      &__text {
        margin-left: 8px;
      }
    }
  }

  &__content {
    height: calc(100% - 73px);
    overflow: auto;
    padding: 20px 20px 0 20px;
  }
}
</style>
