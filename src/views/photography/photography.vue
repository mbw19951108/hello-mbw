<template>
  <div class="photography">
    <a-timeline class="photography__timeline" mode="alternate" @scroll="onScroll($event)">
      <a-timeline-item>
        <div>
          I used to think I couldn't lose anyone if I photographed them enough.
          <br />I used photography to stave off lossBut with the recent deaths of many of my friends.
          <br />I realized the limits of what can be preserved.
          <br />我常想，如果我拍了足够的照片，我就不会再失去任何人
          <br />事实上，我的照片让我看到了我失去了多少
        </div>
        <div class="photography__timeline__desc">
          <span>—— 《东京之爱》南·戈尔丁</span>
        </div>
      </a-timeline-item>
      <a-timeline-item v-for="photography in photographyList" :key="photography._id">
        <a-image-preview-group>
          <a-image v-for="photo in photography.photos" :key="photo" :src="apiUrl + photo" />
        </a-image-preview-group>
        <div v-if="photography.title">
          <span>{{ photography.title }}</span>
        </div>
        <div v-if="photography.date">
          <calendar-outlined class="photography__timeline__icon" />
          <span>{{ moment(photography.date).format("YYYY-MM-DD") }}</span>
        </div>
        <div v-if="photography.location">
          <environment-outlined class="photography__timeline__icon" />
          <span>{{ photography.location }}</span>
        </div>
        <div class="photography__timeline__desc" v-if="photography.desc">
          <span>{{ photography.desc }}</span>
        </div>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Image, message, Timeline } from "ant-design-vue";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons-vue";
import { PhotographyService } from "@/api";
import { MetaModel, PageQueryModel, PhotographyModel } from "@/api/models";
import moment from "moment";
import _ from "lodash";
export default defineComponent({
  components: {
    [Image.name]: Image,
    [Image.PreviewGroup.name]: Image.PreviewGroup,
    [Timeline.name]: Timeline,
    [Timeline.Item.name]: Timeline.Item,
    CalendarOutlined,
    EnvironmentOutlined,
  },
  setup() {
    let loading = ref(false);
    // 列表数据
    let photographyList = ref<PhotographyModel[]>([]);
    // 分页数据
    let meta = ref<MetaModel>({
      pageNo: 1,
      pageSize: 5,
      total: 0
    });
    // 是否已全部加载
    let end = ref(false);
    onMounted(() => getPhotography());
    const getPhotography = async (query?: PageQueryModel) => {
      try {
        loading.value = true;
        const result = await PhotographyService.search(query);
        if (query) {
          photographyList.value = photographyList.value.concat(result.data);
        } else {
          photographyList.value = result.data;
        }
        meta.value = result.meta!;
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    // 滚动条滚动底部加载更多
    const onScroll = _.throttle(async (event: any) => {
      if (loading.value || end.value) return;
      if (meta.value.pageNo >= meta.value.total / meta.value.pageSize) {
        end.value = true;
        photographyList.value = photographyList.value.concat([
          {
            _id: "",
            title: "感谢观看",
          },
        ]);
        return;
      }
      let scrollBottom =
        event.target.scrollHeight -
        event.target.scrollTop -
        event.target.clientHeight;
      // scrollBottom：滚动到底部的距离
      if (scrollBottom < 300) {
        getPhotography({
          pageNo: meta.value.pageNo + 1,
        });
      }
    }, 500);
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      moment,
      photographyList,
      onScroll,
    };
  },
});
</script>
<style lang="less" scoped>
.photography {
  padding: 30px 50px;
  height: 100%;
  background: #fff;

  &__timeline {
    &::-webkit-scrollbar {
      display: none;
    }

    height: 100%;
    overflow: auto;
    padding: 5px;
    margin: auto;

    &__icon {
      margin-right: 5px;
    }

    &__desc {
      opacity: 0.3;
      font-style: italic;
    }
  }

  ::v-deep .ant-image-img {
    width: auto;
    height: 150px;
    padding: 8px;
  }
}
</style>