<template>
  <div class="container">
    <div class="container__form">
      <a-form layout="vertical">
        <a-form-item v-bind="validateInfos.title"
                     label="主题">
          <a-input v-model:value="modelRef.title"></a-input>
        </a-form-item>
        <a-form-item v-bind="validateInfos.location"
                     label="地点">
          <a-input v-model:value="modelRef.location"></a-input>
        </a-form-item>
        <a-form-item v-bind="validateInfos.desc"
                     label="描述">
          <a-textarea v-model:value="modelRef.desc" />
        </a-form-item>
        <a-form-item v-bind="validateInfos.date"
                     label="日期">
          <a-date-picker v-model:value="modelRef.date" />
        </a-form-item>
        <a-form-item v-bind="validateInfos.photos"
                     label="照片">
          <a-upload v-model:file-list="modelRef.photos"
                    multiple
                    :action="uploadOptions.url"
                    :headers="uploadOptions.headers"
                    list-type="picture">
            <a-button>
              <upload-outlined></upload-outlined>
              上传图片
            </a-button>
          </a-upload>
        </a-form-item>
        <a-button :loading="loading"
                  type="primary"
                  @click="onSubmit">
          提交
        </a-button>
      </a-form>
    </div>
    <div class="container__photography">
      <a-timeline class="container__photography__timeline"
                  mode="alternate"
                  @scroll="onScroll($event)">
        <a-timeline-item>
          <div>
            I used to think I couldn't lose anyone if I photographed them enough.<br>
            I used photography to stave off lossBut with the recent deaths of many of my friends.<br>
            I realized the limits of what can be preserved.<br>
            我常想，如果我拍了足够的照片，我就不会再失去任何人<br>
            事实上，我的照片让我看到了我失去了多少
          </div>
          <div class="container__photography__timeline__desc">
            <span>—— 《东京之爱》南·戈尔丁</span>
          </div>
        </a-timeline-item>
        <a-timeline-item v-for="photography in photographyList"
                         :key="photography._id">
          <a-image-preview-group>
            <a-image v-for="photo in photography.photos"
                     :key="photo"
                     :src="apiUrl + photo" />
          </a-image-preview-group>
          <div v-if="photography.title">
            <span>{{photography.title}}</span>
          </div>
          <div v-if="photography.date">
            <calendar-outlined class="container__photography__timeline__icon" />
            <span>{{moment(photography.date).format("YYYY-MM-DD")}}</span>
          </div>
          <div v-if="photography.location">
            <environment-outlined class="container__photography__timeline__icon" />
            <span>{{photography.location}}</span>
          </div>
          <div class="container__photography__timeline__desc"
               v-if="photography.desc">
            <span>{{photography.desc}}</span>
          </div>
          <a-popconfirm v-if="photography._id"
                        title="确定删除么？"
                        @confirm="onDelPhotography(photography._id)">
            <delete-outlined class="mid__list__icon-delete" />
          </a-popconfirm>
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>
<script lang="ts">
import {
  DatePicker,
  Form,
  Input,
  message,
  Textarea,
  Upload,
  Image,
  Timeline,
  Popconfirm,
} from "ant-design-vue";
import {
  UploadOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { useForm } from "ant-design-vue/lib/form";
import {
  PageQueryModel,
  PhotographyModel,
  PhotographyCreateBody,
} from "@/api/models";
import { PhotographyService } from "@/api";
import moment from "moment";
import lodash from "lodash";
export default {
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [Popconfirm.name]: Popconfirm,
    [DatePicker.name]: DatePicker,
    [Textarea.name]: Textarea,
    [Upload.name]: Upload,
    [Image.name]: Image,
    [Image.PreviewGroup.name]: Image.PreviewGroup,
    [Timeline.name]: Timeline,
    [Timeline.Item.name]: Timeline.Item,
    CalendarOutlined,
    EnvironmentOutlined,
    UploadOutlined,
    DeleteOutlined,
  },
  setup() {
    const photographyList = ref<PhotographyModel[]>([]);
    // 分页数据
    const meta = ref();
    // 是否已全部加载
    const end = ref<boolean>(false);
    // 图片上传配置
    const uploadOptions = {
      url: `${process.env.VUE_APP_API_URL}/photo`,
      headers: { token: localStorage.getItem("token") },
    };
    const loading = ref(false);
    const modelRef = reactive({
      title: null,
      location: null,
      desc: null,
      date: null,
      photos: null,
    });
    const { resetFields, validate, validateInfos } = useForm(
      modelRef,
      reactive({
        title: [
          {
            required: true,
            message: "请填写主题",
          },
          {
            max: 50,
            message: "最多不超过50位",
          },
        ],
        location: [
          {
            max: 20,
            message: "最多不超过20位",
          },
        ],
        desc: [
          {
            max: 200,
            message: "最多不超过200位",
          },
        ],
        date: [
          {
            required: true,
            message: "请选择日期",
          },
        ],
        photos: [],
      })
    );
    onMounted(() => getPhotography());
    // 校验并处理表单数据
    const onSubmit = async () => {
      validate().then((res) => createPhotography(res));
    };
    // 创建摄影条目
    const createPhotography = async (data: any) => {
      let body: PhotographyCreateBody = {
        title: data.title,
        location: data.location,
        desc: data.desc,
        date: data.date,
        photos: [],
      };
      data.photos?.forEach((photo: any) => {
        body.photos?.push(photo.response.data.path);
      });
      try {
        loading.value = true;
        const { success } = await PhotographyService.create(body);
        if (success) {
          loading.value = false;
          message.success("新建成功");
          end.value = false;
          // 重置表单
          resetFields();
          // 获取最新摄影条目
          getPhotography();
        }
      } catch (error: any) {
        loading.value = false;
        message.error(error.message);
      }
    };

    // 获取摄影条目
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
    const onScroll = lodash.throttle(async (event: any) => {
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
    // 删除分类
    const onDelPhotography = async (photographyId: string) => {
      try {
        loading.value = true;
        const { success } = await PhotographyService.delete(photographyId);
        loading.value = false;
        if (success) {
          message.success("删除成功");
          end.value = false;
          // 获取最新摄影条目
          getPhotography();
        }
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    return {
      loading,
      modelRef,
      validateInfos,
      uploadOptions,
      apiUrl: process.env.VUE_APP_API_URL,
      moment,
      photographyList,
      onScroll,
      onSubmit,
      onDelPhotography,
    };
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  &__form {
    width: 400px;
    padding: 40px;
    border-right: 1px solid rgb(235, 237, 240);
    flex-shrink: 0;
    height: 100%;
    overflow: auto;
  }

  &__photography {
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
}
</style>