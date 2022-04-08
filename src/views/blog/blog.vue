<template>
  <div class="container">
    <a-layout class="container__layout">
      <a-layout-sider width="280" class="container__layout__sider">
        <a-menu
          class="container__layout__sider__menu"
          mode="inline"
          :selectedKeys="[selectCategoryId]"
        >
          <a-menu-item :key="'all'" @click="onSelectAll()">
            <span>全部文章</span>
          </a-menu-item>
          <a-sub-menu :key="category._id" v-for="category in categoryList">
            <template #title>
              <span>{{ category.title }}</span>
            </template>
            <a-menu-item
              :key="child._id"
              v-for="child in category.children"
              @click="onSelectCategory(child._id)"
            >
              <span>{{ child.title }}</span>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout-content class="container__layout__content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { Layout, Menu, message } from "ant-design-vue";
import { CategoryService } from "@/api";
import { CategoryModel } from "@/api/models";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "Blog",
  components: {
    [Layout.name]: Layout,
    [Layout.Header.name]: Layout.Header,
    [Layout.Content.name]: Layout.Content,
    [Layout.Sider.name]: Layout.Sider,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const selectCategoryId = ref(route.params.categoryId || "all");
    // 分类列表
    const categoryList = ref<CategoryModel[]>([]);
    watch(
      () => route.path,
      () => {
        selectCategoryId.value = route.params.categoryId || "all";
      }
    );
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
    // 选择分类
    const onSelectCategory = (categoryId: string) => {
      router.push({
        name: "CategoryArticles",
        params: { categoryId },
      });
    };
    // 选择全部文章
    const onSelectAll = () => {
      router.push({
        name: "Articles",
      });
    };
    return {
      categoryList,
      selectCategoryId,
      onSelectCategory,
      onSelectAll,
    };
  },
});
</script>
<style lang="less" scoped>
.container {
  padding: 35px 160px;
  height: 100%;
  &__layout {
    height: 100%;
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
    }
  }
}
</style>
