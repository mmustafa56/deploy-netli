const mongoose = require("mongoose");

const Status = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true },
);
module.exports = mongoose.model("status", Status);
