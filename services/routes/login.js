const express = require("express");
const router = express.Router();
const UserModel = require("../model/userModel");
const CaptchaModel = require("../model/captchaModel");
const md5 = require("md5");
const { generateToken } = require("../tools/token");

router.post("/login", async (req, res) => {
  let { username, password, verify } = { ...req.body };
  if (!username || !password || !verify) {
    res.status(500).json({
      message: "必填项未输入",
    });
    return;
  }

  const captchaList = await CaptchaModel.find()
    .limit(1)
    .sort({ created_time: -1 });
  // 校验验证码
  if (
    verify.toLocaleLowerCase() !== captchaList[0].captcha.toLocaleLowerCase()
  ) {
    res.status(500).json({
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
    let token = generateToken({
      _id: result._id,
    });
    res.json({
      success: true,
      data: {
        token,
      },
    });
  } else {
    res.status(500).json({
      message: "用户不存在",
    });
  }
});

module.exports = router;
