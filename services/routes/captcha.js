const express = require("express");
const router = express.Router();
const svgCaptcha = require("svg-captcha");
const CaptchaModel = require("../model/captchaModel");

router.get("/captcha", async (req, res) => {
  const captcha = svgCaptcha.create();
  const newCaptcha = new CaptchaModel({
    captcha: captcha.text,
    created_time: new Date(),
  });
  const result = await newCaptcha.save();
  if (result) {
    res.type("svg");
    res.send(captcha.data);
  }
});

module.exports = router;
