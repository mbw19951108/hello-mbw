<template>
  <a-form layout="vertical">
    <a-form-item v-bind="validateInfos.title" label="标题名称">
      <a-input v-model:value="modelRef.title"></a-input>
    </a-form-item>
    <a-button :loading="loading" type="primary" @click="onSubmit">提交</a-button>
  </a-form>
</template>
<script lang="ts">
import { Form, Input, message } from "ant-design-vue";
import { defineComponent, reactive, ref, SetupContext } from "vue";
import { useForm } from "ant-design-vue/lib/form";
import { ArticleUpdateBody } from "@/api/models";
import { ArticleService } from "@/api";
export default defineComponent({
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
  },
  props: {
    articleId: {
      type: String,
      required: true,
      default: () => "",
    },
  },
  emits: ["success"],
  setup(props: any, { emit }: SetupContext) {
    let loading = ref(false);
    let modelRef = reactive({
      title: null,
    });
    const { validate, validateInfos } = useForm(
      modelRef,
      reactive({
        parent: [],
        title: [
          {
            required: true,
            message: "请填写标题名称",
          },
          {
            max: 30,
            message: "最多不超过30位",
          },
        ],
      })
    );
    // 校验并处理表单数据
    const onSubmit = async () => {
      validate().then((res) => {
        const body: ArticleUpdateBody = {
          title: res.title,
        };
        updateArticle(body);
      });
    };

    const updateArticle = async (body: ArticleUpdateBody) => {
      try {
        loading.value = true;
        const { success } = await ArticleService.update(props.articleId, body);
        if (success) {
          message.success("编辑成功");
          emit("success");
        }
        loading.value = false;
      } catch (error: any) {
        message.error(error.message);
        loading.value = false;
      }
    };
    return {
      loading,
      modelRef,
      validateInfos,
      onSubmit,
    };
  },
});
</script>