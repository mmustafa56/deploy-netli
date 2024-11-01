const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Order = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    orderNumber: String,
    paypal: String,
    market: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "markets",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    buyerContact: String,
    orderScreenshot: String,
    refundScreenshot: String,
    remark: String,
    status: String,
    orderId: { type: Number, unique: true },
    reviewScreenshot: String,
    orderDate: Date,
    reviewDate: Date,
    refundDate: Date,
  },
  { timestamps: true },
);

Order.plugin(AutoIncrement, { inc_field: "orderId", start_seq: 10000 });
module.exports = mongoose.model("orders", Order);
