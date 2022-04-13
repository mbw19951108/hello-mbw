const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const user = require("./routes/user");
const login = require("./routes/login");
const captcha = require("./routes/captcha");
const category = require("./routes/category");
const article = require("./routes/article");
const photography = require("./routes/photography");
const file = require("./routes/file");
const photo = require("./routes/photo");
const UserModel = require("./model/userModel");

const cors = require("cors");
const { needVerify, verifyToken } = require("./tools/token");

const app = express();
// 跨域
app.use(cors());
// 配置第三方中间件获取post提交的数据
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// 校验token
app.use(async (req, res, next) => {
  if (needVerify(req.url, req.method)) {
    const result = await verifyToken(req.headers.token);
    if (
      result._id &&
      (await UserModel.findById(result._id)).type === "manager"
    ) {
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "token失效，请重新登录",
      });
    }
  } else {
    next();
  }
});
// 配置外部路由模块
app.use("/", user);
// 登录
app.use("/", login);
// 图形验证码
app.use("/", captcha);
// 文章分类
app.use("/", category);
// 文章
app.use("/", article);
// 摄影
app.use("/", photography);
// 文章图片上传
app.use("/", file);
// 摄影图片上传
app.use("/", photo);
// 可访问资源
app.use(express.static("public"));

//监听端口  端口号建议写成3000以上
app.listen(3000);
