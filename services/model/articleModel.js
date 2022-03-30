const mongoose = require("./core");

let ArticleSchema = mongoose.Schema({
  title: { type: String },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  keywords: { type: String },
  content: { type: String },
  click_count: { type: String },
  created_time: { type: Number },
  updated_time: { type: Number },
  is_show: { type: Boolean, default: true },
});

module.exports = mongoose.model("Article", ArticleSchema, "article");
