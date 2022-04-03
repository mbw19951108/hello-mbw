<template>
  <div class="photography">
    <a-timeline class="photography__timeline"
                mode="alternate">
      <a-timeline-item>
        <a-image-preview-group>
          <a-image :width="80"
                   src="https://aliyuncdn.antdv.com/vue.png" />
          <a-image :width="80"
                   src="https://aliyuncdn.antdv.com/logo.png" />
          <a-image :width="80"
                   src="https://aliyuncdn.antdv.com/logo.png" />
          <a-image :width="80"
                   src="https://aliyuncdn.antdv.com/logo.png" />
          <a-image :width="80"
                   src="https://aliyuncdn.antdv.com/logo.png" />
          <a-image :width="80"
                   src="https://aliyuncdn.antdv.com/logo.png" />
          <a-image :width="80"
                   src="https://aliyuncdn.antdv.com/logo.png" />

        </a-image-preview-group>
        <div>
          <calendar-outlined />
          <span>2022-01-12</span>
        </div>
        <div>
          <environment-outlined />
          <span>大连</span>
        </div>
      </a-timeline-item>
      <a-timeline-item>
        <a-image-preview-group>
          <a-image :width="80"
                   src="https://aliyuncdn.antdv.com/vue.png" />
          <a-image :width="80"
                   src="https://aliyuncdn.antdv.com/logo.png" />
        </a-image-preview-group>
        <div>
          <calendar-outlined />
          <span>2022-01-12</span>
        </div>
        <div>
          <environment-outlined />
          <span>大连</span>
        </div>
      </a-timeline-item>
      <a-timeline-item>
        <a-image-preview-group>
          <a-image :width="80"
                   src="https://aliyuncdn.antdv.com/vue.png" />
          <a-image :width="80"
                   src="https://aliyuncdn.antdv.com/logo.png" />
        </a-image-preview-group>
        <div>
          <calendar-outlined />
          <span>2022-01-12</span>
        </div>
        <div>
          <environment-outlined />
          <span>大连</span>
        </div>
      </a-timeline-item>
      <a-timeline-item>
        感谢观看
      </a-timeline-item>
    </a-timeline>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { Image, Timeline } from "ant-design-vue";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "Photography",
  components: {
    [Image.name]: Image,
    [Image.PreviewGroup.name]: Image.PreviewGroup,
    [Timeline.name]: Timeline,
    [Timeline.Item.name]: Timeline.Item,
    CalendarOutlined,
    EnvironmentOutlined,
  },
  setup() {
    return {
      visible: ref(false),
    };
  },
});
</script>
<style lang="less" scoped>
.photography {
  padding: 35px 50px;
  height: 100%;
  background: #fff;
  &__timeline {
    height: 100%;
    overflow: auto;
  }
}
</style>