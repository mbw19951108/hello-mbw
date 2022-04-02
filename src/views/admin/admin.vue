<template>
  <div class="container">
    <!-- 文章分类 -->
    <div class="left">
      <a-menu class="left__menu"
              mode="inline">
        <a-button class="left__btn"
                  type="primary"
                  @click="onCreateCategory()">
          <template #icon>
            <plus-outlined />
          </template>
          新建分类
        </a-button>
        <a-sub-menu :key="category._id"
                    v-for="category in categoryList">
          <template #title>
            <span>{{category.title}}</span>
          </template>
          <a-menu-item :key="child._id"
                       v-for="child in category.children"
                       @click="onSelectCategory(child._id)">
            <span>{{child.title}}</span>
            <edit-outlined class="left__menu__icon-edit"
                           @click="onEditCategory()" />
            <a-popconfirm title="确定删除该分类？"
                          @confirm="onDelCategory(child._id)">
              <delete-outlined class="left__menu__icon-delete" />
            </a-popconfirm>

          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <!-- 文章列表 -->
    <div class="mid">
      <a-button class="mid__btn"
                type="primary"
                @click="onCreateArticle()">
        <template #icon>
          <plus-outlined />
        </template>
        新建文章
      </a-button>
      <div class="mid__list"
           :class="{'mid__list-active': article._id === selectArticleId}"
           v-for="article in articleList"
           :key="article._id"
           @click="onSelectArticle(article._id)">
        <div class="mid__list__title">
          <a-tooltip placement="topLeft">
            <template #title>{{article.title}}</template>
            <span :class="{'mid__list__title-unpublish': !article.is_show}">{{article.title}}</span>
          </a-tooltip>
        </div>
        <edit-outlined class="mid__list__icon-edit"
                       @click="onEditArticle()" />
        <a-popconfirm title="确定删除该文章？"
                      @confirm="onDelArticle(article._id)">
          <delete-outlined class="mid__list__icon-delete" />
        </a-popconfirm>
      </div>
    </div>
    <!-- markdown编辑器 -->
    <div class="right">
      <mavon-editor class="right__editor"
                    v-model="mdcontent"
                    ref="md"
                    @imgAdd="onImgAdd"
                    @save="onSave">
        <template #left-toolbar-after>
          <span class="mid__list__publish"
                v-if="!articleDetail?.is_show"
                @click="onPublish()">发布</span>
          <span class="mid__list__unpublish"
                v-if="articleDetail?.is_show"
                @click="onUnpublish()">取消发布</span>
        </template>
      </mavon-editor>
    </div>
  </div>
  <!-- mdoal -->
  <a-modal :destroyOnClose="true"
           :visible="showModal"
           :footer="null"
           :title="modalTitle"
           @cancel="onCancel()">
    <category-create v-if="modalType === ModalType.categoryCreate"
                     :categoryList="categoryList"
                     @success="onCategorySuccess()"></category-create>
    <category-update v-if="modalType === ModalType.categoryUpdate"
                     :categoryId="selectCategoryId"
                     @success="onCategorySuccess()"></category-update>
    <article-update v-if="modalType === ModalType.articleUpdate"
                    :articleId="selectArticleId"
                    @success="onArticleSuccess()"></article-update>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  Tooltip,
  Input,
  Menu,
  Modal,
  Popconfirm,
  message,
} from "ant-design-vue";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { ArticleService, CategoryService, FileService } from "@/api";
import CategoryCreate from "./category-create.vue";
import CategoryUpdate from "./category-update.vue";
import ArticleUpdate from "./article-update.vue";
import { ArticleModel, CategoryModel } from "@/api/models";
import moment from "moment";

export enum ModalType {
  articleUpdate = "articleUpdate",
  categoryUpdate = "categoryUpdate",
  categoryCreate = "categoryCreate",
}

export enum ModalTitle {
  articleUpdate = "编辑文章标题",
  categoryUpdate = "编辑分类",
  categoryCreate = "新建分类",
}

export default defineComponent({
  components: {
    [Input.name]: Input,
    [Modal.name]: Modal,
    [Tooltip.name]: Tooltip,
    [Popconfirm.name]: Popconfirm,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CategoryCreate,
    CategoryUpdate,
    ArticleUpdate,
  },
  setup() {
    const md = ref(null);
    const showModal = ref(false);
    const modalTitle = ref();
    const modalType = ref();
    const selectCategoryId = ref<string>();
    const selectArticleId = ref<string>();

    // 分类列表
    const categoryList = ref<CategoryModel[]>([]);
    // 文章列表
    const articleList = ref<ArticleModel[]>([]);
    // 文章详情
    const articleDetail = ref<ArticleModel>();
    // markdown内容
    const mdcontent = ref<string>("");

    onMounted(() => searchCategories());
    // 获取分类
    const searchCategories = async () => {
      try {
        const { data } = await CategoryService.search();
        categoryList.value = data;
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // 获取文章
    const searchArticles = async (categoryId: string) => {
      try {
        const { data } = await ArticleService.searchByCategoryId(categoryId, {
          pageable: 0,
          showAll: true,
        });
        articleList.value = data;
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // 获取文章详情
    const getArticleDetail = async (articleId: string) => {
      try {
        const { data } = await ArticleService.detail(articleId);
        articleDetail.value = data;
        mdcontent.value = data.mdcontent || "";
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // modal：创建分类
    const onCreateCategory = async () => {
      modalType.value = ModalType.categoryCreate;
      modalTitle.value = ModalTitle.categoryCreate;
      showModal.value = true;
    };
    // modal：编辑分类
    const onEditCategory = async () => {
      modalType.value = ModalType.categoryUpdate;
      modalTitle.value = ModalTitle.categoryUpdate;
      showModal.value = true;
    };
    // modal：编辑文章标题
    const onEditArticle = async () => {
      modalType.value = ModalType.articleUpdate;
      modalTitle.value = ModalTitle.articleUpdate;
      showModal.value = true;
    };
    // modal：关闭
    const onCancel = async () => {
      showModal.value = false;
    };
    // modal：分类成功回调
    const onCategorySuccess = async () => {
      onCancel();
      searchCategories();
    };
    // modal：文章成功回调
    const onArticleSuccess = async () => {
      onCancel();
      searchArticles(selectCategoryId.value!);
    };
    // markdown：图片上传
    const onImgAdd = async (pos: any, $file: File) => {
      const formdata = new FormData();
      formdata.append("image", $file);
      try {
        const { data } = await FileService.upload(formdata);
        (md.value as any).$img2Url(
          pos,
          process.env.VUE_APP_API_URL + data.path
        );
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // markdown：保存
    const onSave = async (value: string, render: string) => {
      // value：markdown格式
      // render：html格式
      if (!render) {
        message.warning("请填写文章内容");
        return;
      }
      if (!selectCategoryId.value) {
        message.warning("请选择文章分类");
        return;
      }
      if (!selectArticleId.value) {
        message.warning("请选择文章");
        return;
      }
      const body = {
        content: render,
        mdcontent: value,
      };
      try {
        await ArticleService.update(selectArticleId.value!, body);
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // 删除分类
    const onDelCategory = async (categoryId: string) => {
      try {
        const { success } = await CategoryService.delete(categoryId);
        if (success) {
          searchCategories();
          selectCategoryId.value = "";
          selectArticleId.value = "";
          message.success("删除成功");
        }
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // 删除文章
    const onDelArticle = async (articleId: string) => {
      try {
        const { success } = await ArticleService.delete(articleId);
        if (success) {
          searchArticles(selectCategoryId.value!);
          selectArticleId.value = "";
          message.success("删除成功");
        }
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // 选择文章
    const onSelectArticle = async (articleId: string) => {
      if (selectArticleId.value === articleId) {
        return;
      }
      selectArticleId.value = articleId;
      getArticleDetail(articleId);
    };
    // 选择分类
    const onSelectCategory = async (categoryId: string) => {
      if (selectCategoryId.value === categoryId) {
        return;
      }
      selectCategoryId.value = categoryId;
      selectArticleId.value = "";
      searchArticles(categoryId);
    };
    // 创建文章
    const onCreateArticle = async () => {
      if (!selectCategoryId.value) {
        message.warning("请先选择分类");
        return;
      }
      try {
        const body = {
          title: moment().format("YYYY-MM-DD"),
          category_id: selectCategoryId.value,
        };
        const { success } = await ArticleService.create(body);
        if (success) {
          searchArticles(selectCategoryId.value);
        }
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // 发布文章
    const onPublish = async () => {
      if (!selectArticleId.value) {
        message.warning("请选择文章");
        return;
      }
      try {
        const { success } = await ArticleService.publish(
          selectArticleId.value!
        );
        if (success) {
          message.success("发布成功");
          articleDetail.value!.is_show = true;
        }
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // 取消发布文章
    const onUnpublish = async () => {
      if (!selectArticleId.value) {
        message.warning("请选择文章");
        return;
      }
      try {
        const { success } = await ArticleService.unpublish(
          selectArticleId.value!
        );
        if (success) {
          message.success("取消发布成功");
          articleDetail.value!.is_show = false;
        }
      } catch (error: any) {
        message.error(error.message);
      }
    };
    return {
      mdcontent, // markdown格式文章内容
      md, // markdown
      showModal,
      modalType,
      ModalType, // enum
      modalTitle,
      categoryList,
      articleList,
      articleDetail,
      selectCategoryId,
      selectArticleId,
      onCancel,
      onCategorySuccess,
      onArticleSuccess,
      onImgAdd,
      onSave,
      onCreateCategory,
      onEditCategory,
      onDelCategory,
      onSelectCategory,
      onCreateArticle,
      onEditArticle,
      onSelectArticle,
      onDelArticle,
      onPublish,
      onUnpublish,
    };
  },
});
</script>
<style lang="less" scoped>
@import "~ant-design-vue/lib/style/themes/default.less";

.container {
  height: 100%;
  width: 100%;
  display: flex;
  .left {
    flex-shrink: 0;
    min-width: 180px;
  }
  .mid {
    flex-shrink: 0;
    min-width: 220px;
  }
  .left {
    &__btn {
      margin: 10px 24px 0;
    }
    &__menu {
      height: 100%;

      &__icon-edit {
        display: none;
        position: absolute;
        right: 20px;
        top: 14px;
      }
      &__icon-delete {
        display: none;
        position: absolute;
        right: 0;
        top: 14px;
      }
      .ant-menu-item-selected {
        .left__menu__icon-edit,
        .left__menu__icon-delete {
          display: block;
        }
      }
    }
  }
  .mid {
    &__btn {
      margin: 10px 24px 0;
    }
    &__list {
      height: 40px;
      padding: 10px 24px;
      line-height: 20px;
      position: relative;
      cursor: pointer;
      &__title {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 130px;
      }
      &__title-unpublish {
        opacity: 0.3;
      }
      &__icon-edit {
        display: none;
        position: absolute;
        right: 44px;
        top: 14px;
      }
      &__icon-delete {
        display: none;
        position: absolute;
        right: 24px;
        top: 14px;
      }
      &__publish,
      &__unpublish {
        font-size: 14px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    &__list-active {
      color: @primary-color;
      .mid__list__icon-edit,
      .mid__list__icon-delete {
        display: block;
      }
    }
  }
  .right {
    flex-grow: 1;
    &__editor {
      height: 100%;
      width: 100%;
      z-index: auto;
    }
  }

  ::v-deep .ant-menu-title-content {
    position: relative;
  }
}
</style>
