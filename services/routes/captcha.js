const express = require("express");
const router = express.Router();
const svgCaptcha = require("svg-captcha");

router.get("/captcha", function (req, res) {
  const captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  console.log(req.session.captcha);

  res.type("svg");
  res.status(200).send(captcha.data);
});

module.exports = router;
