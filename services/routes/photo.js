const express = require("express");
const router = express.Router();
const imagemin = require('imagemin');
const imageminMozjpeg  = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const { getMulter } = require("../tools/multer");
// 最大10MB
const maxSize = 10;
// 最多10张
const maxCount = 10;
// 摄影图片上传
const photo = getMulter(maxSize, maxCount, 'photos');

const singleUpload = photo.single("file");
router.post("/photo", async (req, res) => {
  singleUpload(req, res, (err) => {
    if (err) {
      let message;
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          message = `请上传小于${maxSize}MB的图片`;
          break;
        default:
          message = "上传失败";
          break;
      }
      res.status(500).json({
        message,
      });
    } else {
      // 压缩图片
      imagemin([req.file.path], {
        destination: req.file.destination,
        plugins: [
          imageminMozjpeg(),
          imageminPngquant()
        ]
      });
      res.json({
        success: true,
        data: {
          path: `${req.file.path.substring(6)}`,
        },
      });
    }
  });
});

module.exports = router;
