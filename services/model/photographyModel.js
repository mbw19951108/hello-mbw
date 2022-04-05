const mongoose = require("./core");

let PhotographySchema = mongoose.Schema({
  title: { type: String },
  location: { type: String },
  date: { type: String },
  desc: { type: String },
  photos: { type: Array },
});

module.exports = mongoose.model(
  "Photography",
  PhotographySchema,
  "photography"
);
