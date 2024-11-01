const Reserved = require("../models/Reserve");
const User = require("../models/User");
const Product = require("../models/Product");
// const mongoose = require("mongoose");

//Reservation of a product
const reservedAProduct = async (req, res) => {
  try {
    const { pId } = req.params;
    const userId = req.payload._id;

    const productID = await Product.find({ pId });

    if (productID.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No product found.",
      });
    }

    const productId = await Product.findOneAndUpdate(
      { pId },
      { $set: { status: "reserved" } },
      { new: true, upsert: true },
    );
    // console.log(productId.pId,"......................")
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reserved = await Reserved.find({
      createdAt: { $gt: today },
      productId: productId._id,
      userId,
    });

    if (reserved?.length) {
      return res.status(400).json({
        success: false,
        message: "you have already reserved this product.",
      });
    }

    const product = await Product.findOne({ _id: productId._id });
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });
    }
    // console.log(userId)
    const reserve = new Reserved({
      userId,
      productId: productId._id,
    });
    // console.log(reserve)
    await reserve.save(); //////////////////////////////////////////
    return res.status(200).json({
      success: true,
      message: "You  reserve a product",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

// Get all reserved product
const getReservedProduct = async (req, res) => {
  const userId = req?.payload?._id;

  const sellerName = req?.query?.sellerName;
  const productId = req?.query?.productId;
  const market = req?.query?.market;

  const reserved = await Reserved.find({ userId })
    .populate({ path: "productId" })
    .populate("userId");

  const filteredResults = reserved.filter((item) => {
    const sellerCondition = sellerName
      ? item?.productId?.userId?.toHexString() === sellerName
      : true;
    const productIdCondition = productId
      ? item?.productId?.pId == productId
      : true;
    const conditionsMet = sellerCondition && productIdCondition;
    return conditionsMet;
  });

  return res.status(200).json({
    success: true,
    data: filteredResults,
  });
};

const releaseReserved = async (req, res) => {
  try {
    const userId = req.payload._id;
    const { pId } = req.params;

    const product = await Product.findOneAndUpdate(
      { pId },
      { $set: { status: "published" } },
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reservation = await Reserved.findOneAndDelete({
      userId,
      productId: product._id,
    });
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json({ message: "Released successfully!" });
  } catch (error) {
    console.error("Error releasing reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { reservedAProduct, getReservedProduct, releaseReserved };
