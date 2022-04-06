import "ant-design-vue/dist/antd.css";
import "mavon-editor/dist/css/index.css";
import { createApp } from "vue";
import { Button } from "ant-design-vue";
import App from "./app.vue";
import router from "./router";
import mavonEditor from "mavon-editor";

const app = createApp(App);
app.use(Button);
app.use(mavonEditor);
app.use(router).mount("#app");
