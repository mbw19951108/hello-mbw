const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const router = express.Router();
// const bodyParser = require('body-parser')
// const ejs = require("ejs");
//引入外部模块
const user = require("./routes/user");
const login = require("./routes/login");
const captcha = require("./routes/captcha");
const category = require("./routes/category");
const file = require("./routes/file");

const app = express();
//配置模板引擎
// app.engine("html",ejs.__express)
// app.set("view engine","html")
//配置静态web目录
// app.use(express.static("static"))
//配置第三方中间件获取post提交的数据
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

//判断用户有没有登录
// router.use((req, res, next) => {
//   var pathname = url.parse(req.url).pathname;
//   if (req.session.userinfo && req.session.userinfo.username) {
//     next();
//   } else {
//     if (pathname == "/login" || pathname == "/captcha") {
//       next();
//     } else {
//       res.status(500).send({
//         message: "当前用户未登录",
//       });
//       return;
//     }
//   }
// });
//配置session的中间件
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
//配置第三方中间件获取post提交的数据
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//配置外部路由模块
app.use("/", user);
app.use("/", login);
app.use("/", captcha);
// 文章分类
app.use("/", category);
// 文件上传
app.use("/", file);

//监听端口  端口号建议写成3000以上
app.listen(3000);
