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
    <a-layout-content style="padding: 0 50px">
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
<style lang="less">
#components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.layout-container {
  height: 100%;
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
