<template>
  <a-form layout="vertical">
    <a-form-item v-bind="validateInfos.username"
                 label="用户名">
      <a-input v-model:value="modelRef.username"></a-input>
    </a-form-item>
    <a-form-item v-bind="validateInfos.password"
                 label="密码">
      <a-input v-model:value="modelRef.password"
               type="password"></a-input>
    </a-form-item>
    <a-form-item v-bind="validateInfos.verify"
                 label="图形验证码">
      <a-input v-model:value="modelRef.verify"></a-input>
    </a-form-item>
    <div class="captcha"
         @click="getCaptcha()"
         v-html="captchaSvg"></div>
    <a-button :loading="loading"
              type="primary"
              @click="onSubmit">
      提交
    </a-button>
  </a-form>
</template>
<script lang="ts">
import { Form, Input, message } from "ant-design-vue";
import { onMounted, reactive, ref } from "vue";
import { useForm } from "ant-design-vue/lib/form";
import { AuthService, LoginBody } from "@/api";
import { useRouter } from "vue-router";
export default {
  name: "Login",
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const captchaSvg = ref();
    const modelRef = reactive({
      username: "",
      password: "",
      verify: "",
    });
    const { validate, validateInfos } = useForm(
      modelRef,
      reactive({
        username: [
          {
            required: true,
            message: "请填写用户名",
          },
          {
            max: 20,
            message: "最多不超过20位",
          },
        ],
        password: [
          {
            required: true,
            message: "请填写密码",
          },
          {
            max: 20,
            message: "最多不超过20位",
          },
        ],
        verify: [
          {
            required: true,
            message: "请填写图形验证码",
          },
          {
            max: 4,
            message: "最多不超过4位",
          },
        ],
      })
    );

    onMounted(() => getCaptcha());
    // 获取图形验证码
    const getCaptcha = async () => {
      try {
        const result = await AuthService.captcha();
        captchaSvg.value = result;
      } catch (error: any) {
        message.error(error.message);
      }
    };
    const onSubmit = async () => {
      validate().then((res) => {
        const body: LoginBody = {
          username: res.username,
          password: res.password,
          verify: res.verify,
        };
        login(body);
      });
    };

    const login = async (body: LoginBody) => {
      try {
        loading.value = true;
        const { success } = await AuthService.login(body);
        if (success) {
          loading.value = false;
          message.success("登录成功");
          router.push("/admin");
        }
      } catch (error: any) {
        loading.value = false;
        message.error(error.message);
        getCaptcha();
      }
    };
    return {
      loading,
      modelRef,
      validateInfos,
      captchaSvg,
      getCaptcha,
      onSubmit,
    };
  },
};
</script>
<style lang="less" scoped>
.captcha {
  width: 150px;
  height: 50px;
}
</style>