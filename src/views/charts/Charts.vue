<template>
  <div id="container"
       ref="container"></div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
export default {
  setup() {
    const container = ref<HTMLDivElement>();
    onMounted(() => {
      setTimeout(() => {
        const myChart = echarts.init(container.value!);
        const option: any = {
          mapbox3D: {
            style: "mapbox://styles/mapbox/dark-v9",
          },
        };
        myChart.setOption(option);
      });
    });

    return {
      container,
    };
  },
};
</script>
<style lang="less" scoped>
.ant-layout-content {
  background-color: #001529;
}
#container {
  height: 100%;
}
</style>