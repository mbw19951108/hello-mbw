const multer = require("multer");
const moment = require("moment");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// 最大10MB
const maxSize = 10 * 1024 * 1024;
// 最多20张
const maxCount = 20;
// 摄影图片上传
const photo = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const dir = "./public/photos/" + moment().format("YYYYMMDD");
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
  limits: {
    fileSize: maxSize,
    files: maxCount,
  },
  fileFilter: (req, file, cb) => {
    // 校验图片格式
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const singleUpload = photo.single("image");
router.post("/photo", async (req, res) => {
  singleUpload(req, res, (err) => {
    if (err) {
      let message;
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          message = "请上传小于10MB的图片";
          break;
        default:
          message = "上传失败";
          break;
      }
      res.status(500).json({
        message,
      });
    } else {
      res.json({
        data: {
          path: `${req.file.path.substring(6)}`,
        },
      });
    }
  });
});

module.exports = router;
