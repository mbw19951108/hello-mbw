const mongoose = require("mongoose");
const config = require("../config/config");

mongoose.connect(config.dbUrl, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("mongo connect!");
});

module.exports = mongoose;
