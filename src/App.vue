<template>
  <router-view />
</template>

<script lang="ts">
import { onMounted } from "vue";
export default {
  name: "App",
  components: {},
  setup() {
    onMounted(() => {
      // setTimeout(() => {
      //   window.L2Dwidget.init({
      //     pluginRootPath: "../static/live2dw/",
      //     pluginJsPath: "lib/",
      //     pluginModelPath: "live2d-widget-model-haru_2/assets/", //中间这个haru_2就是你的老婆,想换个老婆,换这个就可以了
      //     tagMode: false,
      //     debug: false,
      //     model: {
      //       jsonPath:
      //         "../static/live2dw/live2d-widget-model-haru_2/assets/haru02.model.json",
      //     },
      //     display: { position: "left", width: 350, height: 800 }, //调整大小,和位置
      //     mobile: { show: true }, //要不要盯着你的鼠标看
      //     log: false,
      //   });
      // }, 1000);
    });
  },
};
</script>

<style lang="less">
@import "src/styles/variables.less";
#app {
  height: 100%;
  position: relative;
}
</style>
