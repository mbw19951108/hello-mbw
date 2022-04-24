<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { defineComponent } from "vue";
import { ConfigProvider } from "ant-design-vue";

export default defineComponent({
  name: "App",
  components: {
    [ConfigProvider.name]: ConfigProvider,
  },
  setup() {
    return {
      locale: zhCN,
    };
  },
});
</script>

<style lang="less">
@import "src/styles/variables.less";

#app {
  height: 100%;
  position: relative;
}
</style>
