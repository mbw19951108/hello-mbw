const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// token校验白名单
const whiteUrls = [
  {
    url: "/login",
    method: "POST",
  },
  {
    url: "/captcha",
    method: "GET",
  },
  {
    url: "/category",
    method: "GET",
  },
  {
    url: "/article",
    method: "GET",
  },
  {
    url: "/upload",
    method: "GET",
  },
  {
    url: "/photography",
    method: "GET",
  },
  {
    url: "/photo",
    method: "GET",
  },
];

const token = {
  // 判断是否需要进行token校验
  needVerify(url, method) {
    return (
      whiteUrls.findIndex(
        (item) => url.includes(item.url) && method === item.method
      ) === -1
    );
  },
  // 生成token
  generateToken(data) {
    // 私钥
    const cert = fs.readFileSync(
      path.join(__dirname, "../config/private_key.pem")
    );
    const token = jwt.sign(
      {
        data,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 7 * 24, // 一周过期
      },
      cert,
      { algorithm: "RS256" }
    );
    return token;
  },
  // 验证token
  verifyToken(token) {
    // 公钥
    let res;
    const cert = fs.readFileSync(
      path.join(__dirname, "../config/public_key.pem")
    );
    try {
      let result = jwt.verify(token, cert, { algorithms: ["RS256"] }) || {};
      let { exp = 0 } = result,
        current = Math.floor(Date.now() / 1000);
      if (current <= exp) {
        res = result.data || {};
      }
    } catch (error) {
      res = error;
    }
    return res;
  },
};

module.exports = token;
