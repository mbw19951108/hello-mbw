const mongoose = require("./core");

let UserSchema = mongoose.Schema({
  name: { type: String },
  username: { type: String },
  password: { type: String },
  email: { type: String },
  mobile: { type: String },
  type: { type: String, default: "user" },
  createdAt: { type: Number },
  loginAt: { type: Number },
});

module.exports = mongoose.model("User", UserSchema, "user");
