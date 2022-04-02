const mongoose = require("./core");

let CaptchaSchema = mongoose.Schema({
  captcha: { type: String },
  created_time: { type: Number },
});

module.exports = mongoose.model("Captcha", CaptchaSchema, "captcha");
