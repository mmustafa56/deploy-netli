const mongoose = require("mongoose");

const ChineseSeller = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true },
);
module.exports = mongoose.model("chineseSeller", ChineseSeller);
