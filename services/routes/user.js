const express = require("express");
const md5 = require("md5");
const router = express.Router();
const UserModel = require("../model/userModel");

router
  .route("/user")
  .get(async (req, res) => {
    const result = await UserModel.find();
    res.json({
      data: result,
    });
  })
  .post(async (req, res) => {
    const { name, username, password, email, mobile, type } = {
      ...req.body,
    };

    if (!username || !password) {
      res.status(500).json({
        message: "用户名密码不能为空",
      });
      return;
    }
    if (password.length < 6) {
      res.status(500).json({
        message: "密码长度不能小于6位",
      });
      return;
    }
    if (username.length > 20) {
      res.status(500).json({
        message: "用户名长度不能大于20位",
      });
      return;
    }
    if (password.length > 20) {
      res.status(500).json({
        message: "密码长度不能大于20位",
      });
      return;
    }
    if (type && type !== "manager" && type !== "user") {
      res.status(500).json({
        message: "用户类型不正确",
      });
      return;
    }

    const user = await UserModel.find({ username: username });
    if (user[0]) {
      res.status(500).json({
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
      created_time: new Date(),
    });
    const result = await newUser.save();
    result &&
      res.json({
        success: true,
      });
  });

router
  .route("/user/:userId")
  .get(async (req, res) => {
    const _id = mongoose.Types.ObjectId(req.params.userId);
    const result = await UserModel.findById(_id);
    result &&
      res.json({
        data: result,
      });
  })
  .put(async (req, res) => {
    const _id = mongoose.Types.ObjectId(req.params.userId);
    const { name, email, mobile } = {
      ...req.body,
    };
    const result = await UserModel.findByIdAndUpdate(_id, {
      name,
      email,
      mobile,
    });
    result &&
      res.json({
        success: true,
      });
  })
  .delete(async (req, res) => {
    const _id = mongoose.Types.ObjectId(req.params.userId);
    const result = await UserModel.findByIdAndDelete(_id);
    result &&
      res.json({
        success: true,
      });
  });

module.exports = router;
