const multer = require("multer");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

/**
 * @param maxSize 大小
 * @param maxCount 数量
 * @param dirPath 存放路径
 * @returns
 */
getMulter = (maxSize, maxCount, dirPath) => {
  return multer({
    storage: multer.diskStorage({
      destination: async (req, file, cb) => {
        const dir = `./public/${dirPath}/${moment().format("YYYYMMDD")}`;
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
      fileSize: maxSize * 1024 * 1024,
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
  })
};

module.exports = { getMulter };