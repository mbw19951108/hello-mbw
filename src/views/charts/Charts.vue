<template>
  <div id="gridContainer" ref="gridContainer"></div>
</template>
<script lang="ts">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
export default {
  setup() {
    const gridContainer = ref<HTMLDivElement>();
    onMounted(() => {
      const gridChart = echarts.init(gridContainer.value!);
      const option: any = {
        visualMap: {
          show: false,
          dimension: 2,
          min: -1,
          max: 1,
        },
        grid3D: {
          boxWidth: 80,
          boxHeight: 80,
          boxDepth: 80,
        },
        xAxis3D: {},
        yAxis3D: {},
        zAxis3D: {},
        series: [
          {
            type: "surface",
            parametric: true,
            // shading: 'albedo',
            parametricEquation: {
              u: {
                min: -Math.PI,
                max: Math.PI,
                step: Math.PI / 20,
              },
              v: {
                min: 0,
                max: Math.PI,
                step: Math.PI / 20,
              },
              x: function (u: number, v: number) {
                return Math.sin(v) * Math.sin(u);
              },
              y: function (u: number, v: number) {
                return Math.sin(v) * Math.cos(u);
              },
              z: function (u: number, v: number) {
                return Math.cos(v);
              },
            },
          },
        ],
      };
      gridChart.setOption(option);
    });

    return {
      gridContainer,
    };
  },
};
</script>
<style lang="less" scoped>
.ant-layout-content {
  background-color: #001529;
}
#gridContainer {
  height: 100%;
}
</style>