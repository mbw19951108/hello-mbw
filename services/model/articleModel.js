const mongoose = require("./core");

let ArticleSchema = mongoose.Schema({
  title: { type: String },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  keywords: { type: String },
  content: { type: String, default: "" },
  mdcontent: { type: String, default: "" },
  click_count: { type: Number, default: 0 },
  created_time: { type: Number },
  updated_time: { type: Number },
  is_show: { type: Boolean, default: false },
});

module.exports = mongoose.model("Article", ArticleSchema, "article");
