<template>
  <a-layout class="layout-container">
    <a-layout-header class="header">
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys"
              theme="dark"
              mode="horizontal"
              :style="{ lineHeight: '64px' }">
        <a-menu-item v-for="route in filterRoutes()"
                     :key="route.name">
          <router-link :to="{ path: route.path }">
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
import { defineComponent, ref } from "vue";
import { Layout, Menu, Breadcrumb } from "ant-design-vue";
import { menuRoutes } from "@/router/routes";
import { useRouter } from "vue-router";

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
  },
  setup() {
    const router = useRouter();
    const selectedKeys = ref([router.currentRoute.value.name]);
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
.layout-container {
  height: 100%;
}
</style>
