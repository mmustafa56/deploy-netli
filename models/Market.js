const mongoose = require("mongoose");

const Market = mongoose.Schema(
  {
    name: String,
    shortName: String,
  },
  { timestamps: true },
);
module.exports = mongoose.model("markets", Market);
