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
    if (type && (type !== "manager" || type !== "user")) {
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
    result && res.end();
  });

router
  .route("/user/:userId")
  .get(async (req, res) => {
    const result = await UserModel.findById(req.params.userId);
    if (result) {
      res.json({
        data: result,
      });
    } else {
      res.status(500).json({
        message: "当前用户不存在",
      });
    }
  })
  .patch(async (req, res) => {
    const { name, email, mobile } = {
      ...req.body,
    };
    const result = await UserModel.findByIdAndUpdate(req.params.userId, {
      name,
      email,
      mobile,
    });
    if (result) {
      res.end();
    } else {
      res.status(500).json({
        message: "当前用户不存在",
      });
    }
  })
  .delete(async (req, res) => {
    const result = await UserModel.findByIdAndDelete(req.params.userId);
    if (result) {
      res.json({
        message: "删除成功",
      });
    } else {
      res.status(500).json({
        message: "当前用户不存在",
      });
    }
  });

module.exports = router;
