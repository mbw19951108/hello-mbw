const multer = require("multer");
const moment = require("moment");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const dir = "./static/upload/" + moment().format("YYYYMMDD");
      // 判断目录是否存在，没有则创建
      if (!fs.existsSync(dir)) {
        await fs.mkdirSync(dir, {
          recursive: true,
        });
      }
      cb(null, dir);
    },
    filename: async (req, file, cb) => {
      // 获取文件后缀名
      let extname = path.extname(file.originalname);
      // 根据时间戳生成文件名
      cb(null, Date.now() + extname);
    },
  }),
});

router.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  res.status(201).json({
    file: req.file,
  });
});

module.exports = router;
