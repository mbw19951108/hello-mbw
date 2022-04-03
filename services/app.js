const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
//引入外部模块
const user = require("./routes/user");
const login = require("./routes/login");
const captcha = require("./routes/captcha");
const category = require("./routes/category");
const article = require("./routes/article");
const file = require("./routes/file");
const photos = require("./routes/photos");
const cors = require("cors");
const { needVerify, verifyToken } = require("./tools/token");

const app = express();
// 跨域
app.use(cors());
// 配置session的中间件
app.use(
  session({
    secret: "this is session", //服务器端生成 session 的签名
    name: "itying", //修改session对应cookie的名称
    resave: false, //强制保存 session 即使它并没有变化
    saveUninitialized: true, //强制将未初始化的 session 存储
    cookie: {
      maxAge: 1000 * 60 * 30,
      secure: false, // true 表示只有https协议才能访问cookie
    },
    rolling: true, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
  })
);
// 配置第三方中间件获取post提交的数据
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// 校验token
app.use(async (req, res, next) => {
  if (needVerify(req.url, req.method)) {
    const result = await verifyToken(req.headers.token);
    if (result._id) {
      next();
    } else {
      res.status(401).json({
        message: "token失效，请重新登录",
      });
    }
  } else {
    next();
  }
});
// 配置外部路由模块
app.use("/", user);
app.use("/", login);
app.use("/", captcha);
// 文章分类
app.use("/", category);
// 文章
app.use("/", article);
// 文章图片上传
app.use("/", file);
// 摄影图片上传
app.use("/", photos);

// 可访问资源
app.use(express.static("public"));

//监听端口  端口号建议写成3000以上
app.listen(3000);
