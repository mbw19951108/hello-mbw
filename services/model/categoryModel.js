const mongoose = require("./core");

let CategorySchema = mongoose.Schema({
  title: { type: String },
  parent_id: {
    type: mongoose.Schema.Types.Mixed, //混合类型
    default: 0,
  },
  sort: {
    type: Number,
    default: 100,
  },
});

module.exports = mongoose.model("Category", CategorySchema, "category");
