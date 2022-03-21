const mongoose = require("./core");

let ArticleSchema = mongoose.Schema({
  title: { type: String },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  description: { type: String },
  keywords: { type: String },
  content: { type: String },
  content: { type: String },
  clickCount: { type: String },
  author: { type: String },
  createdAt: { type: Number },
  updatedAt: { type: Number },
  isShow: { type: Boolean, default: true },
  sort: {
    type: Number,
    default: 100,
  },
});

module.exports = mongoose.model("Article", ArticleSchema, "article");
