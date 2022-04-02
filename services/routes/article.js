const express = require("express");
const router = express.Router();
const ArticleModel = require("../model/articleModel");
const mongoose = require("../model/core");

router
  .route("/article")
  .get(async (req, res) => {
    const pageNo = req.query.pageNo || 1;
    const pageSize = req.query.pageSize || 10;
    const params = {
      is_show: true,
    };
    let result = null;
    result = await ArticleModel.find(params, { content: 0, mdcontent: 0 })
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
      .sort({ created_time: -1 });
    const total = await (
      await ArticleModel.find(params, { content: 0, mdcontent: 0 })
    ).length;
    res.json({
      data: result,
      meta: {
        pageNo,
        pageSize,
        total,
      },
    });
  })
  .post(async (req, res) => {
    const { title, category_id } = { ...req.body };
    if (!category_id) {
      res.status(500).json({
        message: "请选择文章分类",
      });
    }
    if (!title) {
      res.status(500).json({
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
  const pageSize = req.query.pageSize || 10;
  const pageable = req.query.pageable;
  const showAll = req.query.showAll;
  const category_id = mongoose.Types.ObjectId(req.params.categoryId);
  let params;
  if (showAll) {
    params = { category_id };
  } else {
    params = { is_show: true, category_id };
  }
  let result = null;
  if (pageable === "0") {
    result = await ArticleModel.find(params, { content: 0, mdcontent: 0 }).sort(
      { created_time: -1 }
    );
  } else {
    result = await ArticleModel.find(params, { content: 0, mdcontent: 0 })
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
      .sort({ created_time: -1 });
  }
  const total = await (
    await ArticleModel.find(params, { content: 0, mdcontent: 0 })
  ).length;
  res.json({
    data: result,
    meta: {
      pageNo,
      pageSize,
      total,
    },
  });
});

router
  .route("/article/:articleId")
  .get(async (req, res) => {
    const article_id = mongoose.Types.ObjectId(req.params.articleId);
    const { click_count } = await ArticleModel.findOne({
      _id: article_id,
    });
    const result = await ArticleModel.findOneAndUpdate(
      {
        _id: article_id,
      },
      {
        click_count: click_count + 1,
      }
    );
    res.json({
      data: result,
    });
  })
  .patch(async (req, res) => {
    const article_id = mongoose.Types.ObjectId(req.params.articleId);
    const { title, keywords, content, mdcontent, is_show } = {
      ...req.body,
    };

    const result = await ArticleModel.findOneAndUpdate(
      {
        _id: article_id,
      },
      {
        title,
        keywords,
        content,
        mdcontent,
        is_show,
        updated_time: new Date(),
      }
    );

    if (result) {
      res.json({
        success: true,
      });
    } else {
      res.status(500).json({
        message: "当前文章不存在",
      });
    }
  })
  .delete(async (req, res) => {
    const article_id = mongoose.Types.ObjectId(req.params.articleId);

    const result = await ArticleModel.deleteOne({
      _id: article_id,
    });
    if (result) {
      res.json({
        success: true,
      });
    } else {
      res.status(500).json({
        message: "当前文章不存在",
      });
    }
  });

router.route("/article/:articleId/publish").patch(async (req, res) => {
  const article_id = mongoose.Types.ObjectId(req.params.articleId);
  const result = await ArticleModel.findOneAndUpdate(
    {
      _id: article_id,
    },
    {
      is_show: true,
    }
  );

  if (result) {
    res.json({
      success: true,
    });
  } else {
    res.status(500).json({
      message: "当前文章不存在",
    });
  }
});

router.route("/article/:articleId/unpublish").patch(async (req, res) => {
  const article_id = mongoose.Types.ObjectId(req.params.articleId);
  const result = await ArticleModel.findOneAndUpdate(
    {
      _id: article_id,
    },
    {
      is_show: false,
    }
  );

  if (result) {
    res.json({
      success: true,
    });
  } else {
    res.status(500).json({
      message: "当前文章不存在",
    });
  }
});
module.exports = router;
