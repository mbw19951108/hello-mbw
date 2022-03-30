const express = require("express");
const router = express.Router();
const CategoryModel = require("../model/categoryModel");
const ArticleModel = require("../model/articleModel");
const mongoose = require("../model/core");

router
  .route("/category")
  .get(async (req, res) => {
    const result = await CategoryModel.aggregate([
      {
        $lookup: {
          from: "category",
          localField: "_id",
          foreignField: "parent_id",
          as: "children",
        },
      },
      {
        $match: {
          parent_id: 0,
        },
      },
    ]);
    res.send({
      data: result,
    });
  })
  .post(async (req, res) => {
    const { title, parentId, description, sort } = {
      ...req.body,
    };

    if (!title) {
      res.status(400).json({
        message: "分类名称不能为空",
      });
    }

    if (parentId) {
      parent_id = mongoose.Types.ObjectId(parentId);
    } else {
      parent_id = 0;
    }

    if (sort && typeof sort !== "number") {
      res.status(400).json({
        message: "请求参数格式不正确",
      });
    }

    const newCategory = new CategoryModel({
      title,
      parent_id,
      description,
      sort,
    });
    const result = await newCategory.save();
    result &&
      res.json({
        success: true,
      });
  });

router
  .route("/category/:categoryId")
  .get(async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.categoryId);
    const result = await CategoryModel.findById(id);
    if (result) {
      res.json({
        data: result,
      });
    } else {
      res.status(404).json({
        message: "当前分类不存在",
      });
    }
  })
  .patch(async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.categoryId);
    const { title, parent_id, description, sort } = {
      ...req.body,
    };

    if (sort && typeof sort !== "number") {
      res.status(400).json({
        message: "请求参数格式不正确",
      });
    }

    const result = await CategoryModel.findByIdAndUpdate(id, {
      title,
      parent_id,
      description,
      sort,
    });

    if (result) {
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        message: "当前分类不存在",
      });
    }
  })
  .delete(async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.categoryId);
    const childResult = await CategoryModel.find({
      parent_id: id,
    });
    if (childResult.length > 0) {
      res.status(400).json({
        message: "请先删除子分类",
      });
    } else {
      const articleResult = await ArticleModel.find({
        category_id: id,
      });
      if (articleResult.length > 0) {
        res.status(400).json({
          message: "请先删除该分类下的文章",
        });
      } else {
        const result = await CategoryModel.findByIdAndDelete(id);
        if (result) {
          res.json({
            success: true,
          });
        } else {
          res.status(400).json({
            message: "当前分类不存在",
          });
        }
      }
    }
  });

module.exports = router;
