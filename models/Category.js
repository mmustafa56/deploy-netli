const mongoose = require("mongoose");

const Category = mongoose.Schema(
  {
    // _id: mongoose.Types.ObjectId,
    name: String,
  },
  { timestamps: true },
);
module.exports = mongoose.model("categories", Category);
