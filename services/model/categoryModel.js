const mongoose = require("./core");

let CategorySchema = mongoose.Schema({
  title: { type: String },
  parentId: {
    type: mongoose.Schema.Types.Mixed, //混合类型
  },
  description: { type: String },
  sort: {
    type: Number,
    default: 100,
  },
});

module.exports = mongoose.model("Category", CategorySchema, "category");
