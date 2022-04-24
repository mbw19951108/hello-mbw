<template>
  <div class="detail">
    <a-spin :spinning="loading">
      <a-page-header class="detail__header" :title="detail?.title" @back="onBack()">
        <template #subTitle>
          <div class="detail__header__subTitle">
            <calendar-outlined />
            <span class="detail__header__subTitle__text">{{
                moment(detail?.created_time).format("YYYY-MM-DD")
            }}</span>
          </div>
          <div class="detail__header__subTitle">
            <eye-outlined />
            <span class="detail__header__subTitle__text">{{ detail?.click_count }}</span>
          </div>
        </template>
      </a-page-header>
    </a-spin>
    <div class="detail__content markdown-body" v-html="detail?.content"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { PageHeader, Spin } from "ant-design-vue";
import { EyeOutlined, CalendarOutlined } from "@ant-design/icons-vue";
import { useRoute } from "vue-router";
import { ArticlesStore } from "@/store";
import { storeToRefs } from 'pinia'
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
    const articlesStore = ArticlesStore();
    const { loading, detail } = storeToRefs(articlesStore);
    onMounted(() => articlesStore.getDetail(route.params.articleId as string));
    const onBack = () => history.back();
    return {
      loading,
      detail,
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
