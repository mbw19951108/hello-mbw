const express = require("express");
const router = express.Router();
const { getMulter } = require("../tools/multer");

// 最大5MB
const maxSize = 5;
// 最多10张
const maxCount = 10;
// 文章图片上传
const upload = getMulter(maxSize, maxCount, 'upload');

const singleUpload = upload.single("file");
router.post("/upload", async (req, res) => {
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
        data: {
          path: `${req.file.path.substring(6)}`,
        },
      });
    }
  });
});

module.exports = router;
