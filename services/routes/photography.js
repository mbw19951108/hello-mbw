const express = require("express");
const router = express.Router();
const PhotographyModel = require("../model/photographyModel");
const mongoose = require("../model/core");

router
  .route("/photography")
  .get(async (req, res) => {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const result = await PhotographyModel.find()
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
      .sort({ date: -1 });
    const total = (await PhotographyModel.find()).length;
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
    const { title, location, date, desc, photos } = { ...req.body };
    if (!title) {
      res.status(500).json({
        message: "请填写标题",
      });
    }
    const photography = new PhotographyModel({
      title,
      location,
      date,
      desc,
      photos,
    });
    const result = await photography.save();
    result &&
      res.json({
        success: true,
      });
  });

router.route("/photography/:photographyId").delete(async (req, res) => {
  const _id = mongoose.Types.ObjectId(req.params.photographyId);
  const result = await PhotographyModel.deleteOne({ _id });
  result &&
    res.json({
      success: true,
    });
});

module.exports = router;
