const mongoose = require("./core");

let UserSchema = mongoose.Schema({
  name: { type: String },
  username: { type: String },
  password: { type: String },
  email: { type: String },
  mobile: { type: String },
  type: { type: String, default: "user" },
  created_time: { type: Number },
  login_time: { type: Number },
});

module.exports = mongoose.model("User", UserSchema, "user");
