const express = require("express");
const md5 = require("md5");
const router = express.Router();
const UserModel = require("../model/userModel");

router.get("/user", async (req, res) => {
  const result = await UserModel.find();
  res.status(200).json({
    data: result,
  });
});

router.post("/user", async (req, res) => {
  const { name, username, password, email, mobile, type } = {
    ...req.body,
  };

  if (!username || !password) {
    res.status(400).json({
      message: "用户名密码不能为空",
    });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({
      message: "密码长度不能小于6位",
    });
    return;
  }
  if (type && (type !== "manager" || type !== "user")) {
    res.status(400).json({
      message: "用户类型不正确",
    });
    return;
  }

  const user = await UserModel.find({ username: username });
  if (user[0]) {
    res.status(400).json({
      message: "当前用户已存在",
    });
    return;
  }
  const newUser = new UserModel({
    name,
    username,
    password: md5(password),
    email,
    mobile,
    type,
    createdAt: new Date(),
  });
  const result = await newUser.save();
  result && res.status(201).end();
});

router
  .route("/user/:userId")
  .get(async (req, res) => {
    const result = await UserModel.findById(req.params.userId);
    if (result) {
      res.status(200).json({
        data: result,
      });
    } else {
      res.status(404).json({
        message: "当前用户不存在",
      });
    }
  })
  .put(async (req, res) => {
    const { name, email, mobile } = {
      ...req.body,
    };
    const result = await UserModel.findByIdAndUpdate(req.params.userId, {
      name,
      email,
      mobile,
    });
    if (result) {
      res.status(201).end();
    } else {
      res.status(404).json({
        message: "当前用户不存在",
      });
    }
  })
  .delete(async (req, res) => {
    const result = await UserModel.findByIdAndDelete(req.params.userId);
    if (result) {
      res.status(201).json({
        message: "删除成功",
      });
    } else {
      res.status(404).json({
        message: "当前用户不存在",
      });
    }
  });

module.exports = router;
