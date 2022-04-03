<template>
  <a-layout class="layout-container">
    <a-layout-header class="header">
      <a-menu :selectedKeys="selectedKeys"
              theme="dark"
              mode="horizontal">
        <a-menu-item v-for="route in filterRoutes()"
                     :key="route.name">
          <router-link :to="{ path: route.path }">
            <component :is="route.meta.icon" />
            <span>{{route.meta.title}}</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content>
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
  DashboardOutlined,
} from "@ant-design/icons-vue";
import { menuRoutes } from "@/router/routes";
import { useRoute } from "vue-router";

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
    BulbOutlined,
    CameraOutlined,
    DashboardOutlined,
  },
  setup() {
    const route = useRoute();
    // 顶部导航选中状态
    const selectedKeys = ref<string[]>([]);
    watchEffect(() => (selectedKeys.value = [route.matched[1].name as string]));
    const filterRoutes = () =>
      menuRoutes.filter((route) => {
        if (!route.redirect) return true;
      });
    console.log(selectedKeys);
    return {
      selectedKeys,
      filterRoutes,
    };
  },
});
</script>
<style lang="less" scoped>
.layout-container {
  height: 100%;
}
</style>
