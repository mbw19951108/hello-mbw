<template>
  <a-layout class="layout">
    <a-layout-sider>
      <div class="logo">
        <img src="../../assets/logo.jpg" alt="logo" />
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item v-for="route in filterRoutes()" :key="route.name">
          <router-link :to="{ path: route.path }">
            <span>{{ route.meta?.title }}</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { Layout, Menu } from "ant-design-vue";
import { useRoute } from "vue-router";
import { adminRoutes } from "@/router/routes";

export default defineComponent({
  components: {
    [Layout.name]: Layout,
    [Layout.Content.name]: Layout.Content,
    [Layout.Sider.name]: Layout.Sider,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu,
  },

  setup() {
    const route = useRoute();
    // 顶部导航选中状态
    const selectedKeys = ref<string[]>([]);
    watchEffect(
      () => (selectedKeys.value = [route.matched[1]?.name as string])
    );
    const filterRoutes = () =>
      adminRoutes.filter((route) => {
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
}
.logo {
  margin: 20px auto;
  text-align: center;
  img {
    width: 150px;
    height: 25px;
  }
}
</style>
