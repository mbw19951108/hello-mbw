<template>
  <div class="container">
    <div class="left">
      <a-menu class="left__menu"
              mode="inline">
        <a-button type="primary"
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
    <div class="mid">
      <a-button type="primary"
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
            {{article.title}}
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
    <div class="right">
      <mavon-editor class="right__editor"
                    v-model="content"
                    ref="md"
                    @imgAdd="onImgAdd"
                    @save="onSave" />
    </div>
  </div>

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
                    :categoryId="selectCategoryId"
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
    const articleList = ref<ArticleModel[]>([]);
    const articleDetail = ref<ArticleModel>();

    onMounted(() => {
      searchCategories();
    });
    // 获取文章分类
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
        const { data } = await ArticleService.search(categoryId, {
          pageable: 0,
        });
        articleList.value = data;
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // 获取文章详情
    const getArticleDetail = async (articleId: string) => {
      try {
        const { data } = await ArticleService.detail(
          selectCategoryId.value as string,
          articleId
        );
        articleDetail.value = data;
      } catch (error: any) {
        message.error(error.message);
      }
    };
    // markdown图片上传
    const onImgAdd = async (pos: any, $file: File) => {
      const formdata = new FormData();
      formdata.append("image", $file);
      try {
        const { data } = await FileService.upload(formdata);
        console.log(data);
        (md.value as any).$img2Url(
          pos,
          process.env.VUE_APP_API_URL + data.path
        );
      } catch (error: any) {
        message.error(error.message);
      }
    };
    const onCreateCategory = async () => {
      modalType.value = ModalType.categoryCreate;
      modalTitle.value = ModalTitle.categoryCreate;
      showModal.value = true;
    };
    const onEditCategory = async () => {
      modalType.value = ModalType.categoryUpdate;
      modalTitle.value = ModalTitle.categoryUpdate;
      showModal.value = true;
    };
    const onEditArticle = async () => {
      modalType.value = ModalType.articleUpdate;
      modalTitle.value = ModalTitle.articleUpdate;
      showModal.value = true;
    };
    // 关闭modal
    const onCancel = async () => {
      showModal.value = false;
    };
    const onCategorySuccess = async () => {
      onCancel();
      searchCategories();
    };
    const onArticleSuccess = async () => {
      onCancel();
      searchArticles(selectCategoryId.value as string);
    };
    // markdown保存事件
    const onSave = async (value: string, render: string) => {
      // render：文章解析后的结果
      console.log(render);
      // const body = {
      //   content: render,
      // };
      // try {
      //   const { data } = await ArticleService.create(body);
      //   console.log(data);
      // } catch (error: any) {
      //   message.error(error.message);
      // }
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
        const { success } = await ArticleService.delete(
          selectCategoryId.value as string,
          articleId
        );
        if (success) {
          searchArticles(selectCategoryId.value as string);
          selectArticleId.value = "";
          message.success("删除成功");
        }
      } catch (error: any) {
        message.error(error.message);
      }
    };

    const onSelectArticle = async (articleId: string) => {
      if (selectArticleId.value === articleId) {
        return;
      }
      selectArticleId.value = articleId;
      getArticleDetail(articleId);
    };

    const onSelectCategory = async (categoryId: string) => {
      if (selectCategoryId.value === categoryId) {
        return;
      }
      selectCategoryId.value = categoryId;
      searchArticles(categoryId);
    };

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
    return {
      content: "",
      md,
      showModal,
      modalType,
      ModalType, // enum
      modalTitle,
      categoryList,
      articleList,
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
    &__list {
      height: 40px;
      padding: 10px;
      line-height: 20px;
      position: relative;
      cursor: pointer;
      &__title {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 150px;
      }
      &__icon-edit {
        display: none;
        position: absolute;
        right: 30px;
        top: 14px;
      }
      &__icon-delete {
        display: none;
        position: absolute;
        right: 10px;
        top: 14px;
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
}

::v-deep .ant-menu-title-content {
  position: relative;
}
</style>
