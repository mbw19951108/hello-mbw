const express = require("express");
const router = express.Router();
const UserModel = require("../model/userModel");
const md5 = require("md5");
router.post("/login", async (req, res, next) => {
  let { username, password, verify } = { ...req.body };

  if (!username || !password || !verify) {
    res.status(401).json({
      message: "必填项未输入",
    });
    return;
  }
  if (!req.session.captcha) {
    res.status(500).json({
      message: "验证码已过期",
    });
    return;
  }
  // 校验验证码
  if (verify.toLocaleLowerCase() !== req.session.captcha.toLocaleLowerCase()) {
    res.status(401).json({
      message: "验证码无效",
    });
    return;
  }
  let result = await UserModel.findOneAndUpdate(
    {
      username: username,
      password: md5(password),
    },
    {
      login_time: new Date(),
    }
  );
  if (result) {
    req.session.userinfo = result[0];
    res.send({
      message: "登录成功",
    });
  } else {
    res.status(404).send({
      message: "用户不存在",
    });
  }
});

module.exports = router;
