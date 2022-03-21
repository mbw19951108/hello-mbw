const express = require("express");
const router = express.Router();
const CategoryModel = require("../model/categoryModel");
const ArticleModel = require("../model/articleModel");
const mongoose = require("../model/core");

router.get("/category", async (req, res) => {
  const result = await CategoryModel.aggregate([
    {
      $lookup: {
        from: "article_cate",
        localField: "_id",
        foreignField: "pid",
        as: "items",
      },
    },
    {
      $match: {
        pid: "0",
      },
    },
  ]);
  res.status(200).send({
    data: result,
  });
});

router.post("/category", async (req, res) => {
  const { title, parentId, description, sort } = {
    ...req.body,
  };

  if (!title) {
    res.status(400).json({
      message: "分类名称不能为空",
    });
  }

  if (parentId) {
    parentId = mongoose.Types.ObjectId(parentId);
  }

  if (sort && typeof sort !== "number") {
    res.status(400).json({
      message: "请求参数格式不正确",
    });
  }

  const newCategory = new CategoryModel({
    title,
    parentId,
    description,
    sort,
  });
  const result = await newCategory.save();
  result && res.status(201).end();
});

router
  .route("/category/:categoryId")
  .get(async (req, res) => {
    const result = await CategoryModel.findById(req.params.categoryId);
    if (result) {
      res.status(200).json({
        data: result,
      });
    } else {
      res.status(404).json({
        message: "当前分类不存在",
      });
    }
  })
  .put(async (req, res) => {
    const { title, parentId, description, sort } = {
      ...req.body,
    };

    if (sort && typeof sort !== "number") {
      res.status(400).json({
        message: "请求参数格式不正确",
      });
    }

    const result = await CategoryModel.findByIdAndUpdate(
      req.params.categoryId,
      {
        title,
        parentId,
        description,
        sort,
      }
    );

    if (result) {
      res.status(201).end();
    } else {
      res.status(404).json({
        message: "当前分类不存在",
      });
    }
  })
  .delete(async (req, res) => {
    const id = req.params.categoryId;
    const childResult = await CategoryModel.find({
      parentId: mongoose.Types.ObjectId(id),
    });
    if (childResult.length > 0) {
      res.status(400).json({
        message: "请先删除子分类",
      });
    } else {
      const articleResult = await ArticleModel.find({
        categoryId: mongoose.Types.ObjectId(id),
      });
      if (articleResult.length > 0) {
        res.status(400).json({
          message: "请先删除该分类下的文章",
        });
      } else {
        const result = await CategoryModel.findByIdAndDelete(req.params.id);
        if (result) {
          res.status(201).json({
            message: "删除成功",
          });
        } else {
          res.status(404).json({
            message: "当前分类不存在",
          });
        }
      }
    }
  });

module.exports = router;
