const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Product = new mongoose.Schema(
  {
    keywords: {
      type: String,
    },
    brandName: {
      type: String,
    },
    soldBy: {
      type: String,
    },
    market: {
      type: String,
    },
    seller: {
      type: String,
    },
    categoryId: {
      type: String,
    },
    commission: {
      type: String,
    },
    websiteCommission: {
      type: String,
    },
    limitPerDay: {
      type: String,
    },
    limit: {
      type: String,
    },
    todayRemaining: {
      type: Number,
    },
    instruction: {
      type: String,
    },
    refundPolicy: {
      type: String,
    },
    commissionPolicy: {
      type: String,
    },
    image: {
      type: String,
    },
    screenShot: {
      type: String,
    },
    status: {
      type: String, // pending publish disable
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    pId: {
      type: Number,
      unique: true,
    },
  },
  { timestamps: true },
);

Product.plugin(AutoIncrement, { inc_field: "pId", start_seq: 100000 });
module.exports = mongoose.model("products", Product);
