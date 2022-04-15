<template>
  <a-form layout="vertical">
    <a-form-item v-bind="validateInfos.title" label="分类名称">
      <a-input v-model:value="modelRef.title"></a-input>
    </a-form-item>
    <a-button :loading="loading" type="primary" @click="onSubmit">提交</a-button>
  </a-form>
</template>
<script lang="ts">
import { Form, Input, message } from "ant-design-vue";
import { reactive, ref, defineComponent, SetupContext } from "vue";
import { useForm } from "ant-design-vue/lib/form";
import { CategoryUpdateBody, CategoryModel } from "@/api/models";
import { CategoryService } from "@/api";
export default defineComponent({
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
  },
  props: {
    categoryId: {
      type: String,
      required: true,
      default: () => "",
    },
  },
  emits: ["success"],
  setup(props, { emit }: SetupContext) {
    let loading = ref(false);
    let modelRef = reactive({
      parent: null,
      title: null,
    });
    const { validate, validateInfos } = useForm(
      modelRef,
      reactive({
        parent: [],
        title: [
          {
            required: true,
            message: "请填写分类名称",
          },
          {
            max: 20,
            message: "最多不超过20位",
          },
        ],
      })
    );
    // 校验并处理表单数据
    const onSubmit = async () => {
      validate().then((res) => {
        const body: CategoryUpdateBody = {
          title: res.title,
        };
        updateCategory(body);
      });
    };
    const updateCategory = async (body: CategoryUpdateBody) => {
      try {
        loading.value = true;
        const { success } = await CategoryService.update(
          props.categoryId,
          body
        );
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