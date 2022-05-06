<template>
  <a-layout class="layout">
    <a-layout-header class="layout__header">
      <img class="layout__header__logo" src="@/static/logo.jpg" alt="logo" />
      <a-menu class="layout__header__menu" :selectedKeys="selectedKeys" theme="dark" mode="horizontal">
        <a-menu-item v-for="route in filterRoutes()" :key="route.name">
          <router-link :to="{ path: route.path }">
            <component :is="route.meta!.icon" />
            <span>{{ route.meta?.title }}</span>
          </router-link>
        </a-menu-item>
      </a-menu>
      <div class="layout__header__text">A Photographer, A Programmer!</div>
    </a-layout-header>
    <a-layout-content>
      <!-- github 外链图标 -->
      <github-link></github-link>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { Layout, Menu, Breadcrumb } from "ant-design-vue";
import {
  BulbOutlined,
  CameraOutlined,
  CrownOutlined,
  DashboardOutlined,
} from "@ant-design/icons-vue";
import { useRoute } from "vue-router";
import { menuRoutes } from "@/router/routes";
import GithubLink from "@/views/components/github-link.vue"

export default defineComponent({
  components: {
    [Layout.name]: Layout,
    [Layout.Header.name]: Layout.Header,
    [Layout.Content.name]: Layout.Content,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu,
    [Breadcrumb.name]: Breadcrumb,
    [Breadcrumb.Item.name]: Breadcrumb.Item,
    BulbOutlined,
    CameraOutlined,
    CrownOutlined,
    DashboardOutlined,
    GithubLink
  },
  setup() {
    const route = useRoute();
    // 顶部导航选中状态
    let selectedKeys = ref<string[]>([]);
    watchEffect(
      () => (selectedKeys.value = [route.matched[1]?.name as string])
    );
    const filterRoutes = () =>
      menuRoutes.filter((route) => {
        if (!route.redirect) return true;
      });
    return {
      selectedKeys,
      filterRoutes,
    };
  },
});
</script>
<style lang="less" scoped>
.layout {
  height: 100%;

  &__header {
    display: flex;
    align-items: center;

    &__logo {
      width: 150px;
      height: 25px;
      margin-right: 30px;
    }

    &__menu {
      flex-grow: 1;
    }

    &__text {
      color: #fff;
      opacity: 0.65;
      font-size: 16px;
      font-style: italic;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

::v-deep .ant-layout-content {
  position: relative;
}
</style>
