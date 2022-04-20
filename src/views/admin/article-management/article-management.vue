<template>
  <div class="container">
    <!-- 文章分类 -->
    <div class="left">
      <a-menu class="left__menu" mode="inline">
        <a-button class="left__btn" type="primary" @click="onCreateCategory()">
          <template #icon>
            <plus-outlined />
          </template>
          新建分类
        </a-button>
        <a-sub-menu :key="category._id" v-for="category in categoryList">
          <template #title>
            <span>{{ category.title }}</span>
          </template>
          <a-menu-item :key="child._id" v-for="child in category.children" @click="onSelectCategory(child._id)">
            <span>{{ child.title }}</span>
            <edit-outlined class="left__menu__icon-edit" @click="onEditCategory()" />
            <a-popconfirm title="确定删除该分类？" @confirm="onDelCategory(child._id)">
              <delete-outlined class="left__menu__icon-delete" />
            </a-popconfirm>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <!-- 文章列表 -->
    <div class="mid">
      <a-button class="mid__btn" type="primary" @click="onCreateArticle()">
        <template #icon>
          <plus-outlined />
        </template>
        新建文章
      </a-button>
      <div class="mid__list" :class="{ 'mid__list-active': article._id === selectArticleId }"
        v-for="article in articleList" :key="article._id" @click="onSelectArticle(article._id)">
        <div class="mid__list__title">
          <a-tooltip placement="topLeft">
            <template #title>{{ article.title }}</template>
            <span :class="{ 'mid__list__title-unpublish': !article.is_show }">{{ article.title }}</span>
          </a-tooltip>
        </div>
        <edit-outlined class="mid__list__icon-edit" @click="onEditArticle()" />
        <a-popconfirm title="确定删除该文章？" @confirm="onDelArticle(article._id)">
          <delete-outlined class="mid__list__icon-delete" />
        </a-popconfirm>
      </div>
    </div>
    <!-- markdown编辑器 -->
    <div class="right">
      <mavon-editor class="right__editor" v-model="mdcontent" ref="md" @imgAdd="onImgAdd" @save="onSave">
        <template #left-toolbar-after>
          <a class="mid__list__publish" v-if="!articleDetail?.is_show" @click="onPublish()">发布</a>
          <a class="mid__list__unpublish" v-if="articleDetail?.is_show" @click="onUnpublish()">取消发布</a>
        </template>
      </mavon-editor>
    </div>
  </div>
  <!-- mdoal -->
  <a-modal :destroyOnClose="true" :visible="showModal" :footer="null" :title="modalTitle" @cancel="onCancel()">
    <category-create v-if="modalType === modalTypeList.categoryCreate.value" :categoryList="categoryList"
      @success="onCategorySuccess()"></category-create>
    <category-update v-if="modalType === modalTypeList.categoryUpdate.value" :categoryId="selectCategoryId"
      @success="onCategorySuccess()"></category-update>
    <article-update v-if="modalType === modalTypeList.articleUpdate.value" :articleId="selectArticleId"
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
    const modalTypeList = {
      articleUpdate: {
        text: '编辑文章标题',
        value: 'articleUpdate'
      },
      categoryUpdate: {
        text: '编辑分类',
        value: 'categoryUpdate'
      },
      categoryCreate: {
        text: '新建分类',
        value: 'categoryCreate'
      }
    };
    let loading = ref(false);
    let md = ref(null);
    let showModal = ref(false);
    let modalTitle = ref<string>();
    let modalType = ref<string>();
    let selectCategoryId = ref<string>();
    let selectArticleId = ref<string>();
    // 分类列表
    let categoryList = ref<CategoryModel[]>([]);
    // 文章列表
    let articleList = ref<ArticleModel[]>([]);
    // 文章详情
    let articleDetail = ref<ArticleModel>();
    // markdown内容
    let mdcontent = ref<string>("");

    onMounted(() => searchCategories());
    // 获取分类
    const searchCategories = async () => {
      try {
        loading.value = true;
        const { data } = await CategoryService.search();
        categoryList.value = data;
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    // 获取文章
    const searchArticles = async (categoryId: string) => {
      try {
        loading.value = true;
        const { data } = await ArticleService.search({
          pageable: 0,
          showAll: true,
          categoryId
        });
        articleList.value = data;
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    // 获取文章详情
    const getArticleDetail = async (articleId: string) => {
      try {
        loading.value = true;
        const { data } = await ArticleService.detail(articleId);
        articleDetail.value = data;
        mdcontent.value = data.mdcontent || "";
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    // modal：创建分类
    const onCreateCategory = () => {
      modalType.value = modalTypeList.categoryCreate.value;
      modalTitle.value = modalTypeList.categoryCreate.text;
      showModal.value = true;
    };
    // modal：编辑分类
    const onEditCategory = () => {
      modalType.value = modalTypeList.categoryUpdate.value;
      modalTitle.value = modalTypeList.categoryUpdate.text;
      showModal.value = true;
    };
    // modal：编辑文章标题
    const onEditArticle = () => {
      modalType.value = modalTypeList.articleUpdate.value;
      modalTitle.value = modalTypeList.articleUpdate.text;
      showModal.value = true;
    };
    // modal：关闭
    const onCancel = () => showModal.value = false;
    // modal：分类成功回调
    const onCategorySuccess = () => {
      onCancel();
      searchCategories();
    };
    // modal：文章成功回调
    const onArticleSuccess = () => {
      onCancel();
      searchArticles(selectCategoryId.value!);
    };
    // markdown：图片上传
    const onImgAdd = async (pos: any, $file: File) => {
      const formdata = new FormData();
      formdata.append("file", $file);
      try {
        loading.value = true;
        const { data } = await FileService.upload(formdata);
        (md.value as any).$img2Url(
          pos,
          process.env.VUE_APP_API_URL + data.path
        );
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
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
        loading.value = true;
        const { success } = await ArticleService.update(
          selectArticleId.value!,
          body
        );
        success && message.success("保存成功");
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    // 删除分类
    const onDelCategory = async (categoryId: string) => {
      try {
        loading.value = true;
        const { success } = await CategoryService.delete(categoryId);
        if (success) {
          searchCategories();
          selectCategoryId.value = "";
          selectArticleId.value = "";
          message.success("删除成功");
        }
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    // 删除文章
    const onDelArticle = async (articleId: string) => {
      try {
        loading.value = true;
        const { success } = await ArticleService.delete(articleId);
        if (success) {
          searchArticles(selectCategoryId.value!);
          selectArticleId.value = "";
          message.success("删除成功");
        }
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    // 选择文章
    const onSelectArticle = (articleId: string) => {
      if (selectArticleId.value === articleId) return;
      selectArticleId.value = articleId;
      getArticleDetail(articleId);
    };
    // 选择分类
    const onSelectCategory = (categoryId: string) => {
      if (selectCategoryId.value === categoryId) return;
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
      const body = {
        title: moment().format("YYYY-MM-DD"),
        category_id: selectCategoryId.value,
      };
      try {
        loading.value = true;
        const { success } = await ArticleService.create(body);
        success && searchArticles(selectCategoryId.value);
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    // 发布文章
    const onPublish = async () => {
      if (!selectArticleId.value) {
        message.warning("请选择文章");
        return;
      }
      try {
        loading.value = true;
        const { success } = await ArticleService.publish(
          selectArticleId.value
        );
        if (success) {
          message.success("发布成功");
          articleDetail.value!.is_show = true;
          articleList.value.find(item => item._id === selectArticleId.value)!.is_show = true;
        }
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    // 取消发布文章
    const onUnpublish = async () => {
      if (!selectArticleId.value) {
        message.warning("请选择文章");
        return;
      }
      try {
        loading.value = true;
        const { success } = await ArticleService.unpublish(
          selectArticleId.value!
        );
        if (success) {
          message.success("取消发布成功");
          articleDetail.value!.is_show = false;
          articleList.value.find(item => item._id === selectArticleId.value)!.is_show = false;
        }
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    return {
      loading,
      mdcontent, // markdown格式文章内容
      md, // markdown
      showModal,
      modalTypeList,
      modalType,
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
  background: #fff;
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
