const express = require("express");
const router = express.Router();
const ArticleModel = require("../model/articleModel");
const mongoose = require("../model/core");

router.route("/article").post(async (req, res) => {
  const { title, category_id } = { ...req.body };
  if (!category_id) {
    res.status(400).json({
      message: "请选择文章分类",
    });
  }
  if (!title) {
    res.status(400).json({
      message: "请填写文章标题",
    });
  }
  const newArticle = new ArticleModel({
    category_id: mongoose.Types.ObjectId(category_id),
    title,
    created_time: new Date(),
  });
  const result = await newArticle.save();
  result &&
    res.json({
      success: true,
    });
});

// 文章列表
router.route("/category/:categoryId/article").get(async (req, res) => {
  const pageNo = req.query.pageNo || 1;
  const pageSize = req.query.pageSize || 5;
  const pageable = req.query.pageable;

  const category_id = mongoose.Types.ObjectId(req.params.categoryId);
  let result = null;
  if (pageable === "0") {
    result = await ArticleModel.find({
      category_id,
    }).sort({ created_time: -1 });
  } else {
    result = await ArticleModel.find({
      category_id,
    })
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
      .sort({ created_time: -1 });
  }
  res.json({
    data: result,
  });
});

router
  .route("/category/:categoryId/article/:articleId")
  .get(async (req, res) => {
    const category_id = mongoose.Types.ObjectId(req.params.categoryId);
    const article_id = mongoose.Types.ObjectId(req.params.articleId);
    const result = await ArticleModel.findOne({
      _id: article_id,
      category_id,
    });
    res.json({
      data: result,
    });
  })
  .patch(async (req, res) => {
    const category_id = mongoose.Types.ObjectId(req.params.categoryId);
    const article_id = mongoose.Types.ObjectId(req.params.articleId);
    const { title, keywords, content, is_show } = {
      ...req.body,
    };

    const result = await ArticleModel.findOneAndUpdate(
      {
        _id: article_id,
        category_id,
      },
      {
        title,
        keywords,
        content,
        is_show,
        updated_time: new Date(),
      }
    );

    if (result) {
      res.json({
        success: true,
      });
    } else {
      res.status(400).json({
        message: "当前文章不存在",
      });
    }
  })
  .delete(async (req, res) => {
    const category_id = mongoose.Types.ObjectId(req.params.categoryId);
    const article_id = mongoose.Types.ObjectId(req.params.articleId);

    const result = await ArticleModel.deleteOne({
      _id: article_id,
      category_id,
    });
    if (result) {
      res.json({
        success: true,
      });
    } else {
      res.status(400).json({
        message: "当前文章不存在",
      });
    }
  });

module.exports = router;
