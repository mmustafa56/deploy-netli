const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Market = require("../models/Market");

//Create Product
const addProduct = async (req, res) => {
  try {
    let {
      keywords,
      soldBy,
      categoryId,
      brandName,
      market,
      chineseSeller,
      commission,
      websiteCommission,
      limitPerDay,
      limit,
      instruction,
      refundPolicy,
      commissionPolicy,
    } = req.body;

    const myfile = req.files;
    const image = process.env.baseUrl + "/images/" + myfile?.image[0]?.filename;
    const screenShot =
      process.env.baseUrl + "/images/" + myfile?.screenShot[0]?.filename;

    const product = new Product({
      keywords,
      soldBy,
      categoryId,
      brandName,
      market,
      chineseSeller,
      commission,
      websiteCommission,
      limitPerDay,
      limit,
      instruction,
      refundPolicy,
      commissionPolicy,
      image,
      screenShot,
      status: "published",
      userId: req.payload._id,
    });
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product added successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

//GET ALL PRODUCT
const allProduct = async (req, res) => {
  // const chineseSeller = req?.query?.chineseSeller
  const market = req?.query?.market;
  const categoryId = req?.query?.categoryId;
  const searchByKey = req?.query?.searchByKey;
  const productId = req?.query?.productId;
  try {
    const allProduct = await Product.find({
      ...(productId ? { pId: productId } : {}),
      //  ...(chineseSeller ? {  } : {}),
      ...(market && market !== "ALL" ? { market } : {}),
      ...(categoryId && categoryId !== "65651988b7c6cf1ee7874e92"
        ? { categoryId }
        : {}),
      ...(searchByKey ? { keywords: searchByKey } : {}),
      $or: [{ status: "published" }, { status: "reserved" }],
    }).sort({ pId: -1 });

    // return res.status(201).json({
    //   success: true,
    //   data: allProduct,
    //   message:"This is for testing purpose"
    // });

    const ordersPromises = allProduct.map(async (item) => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const allOrders = await Order.find({
        productId: item?._id.toHexString(),
      });
      let totalLimit = parseInt(item?.limit) - allOrders.length;
      let limitPerDay = parseInt(item?.limitPerDay) - allOrders.length;
      totalLimit = Math.max(0, totalLimit);
      limitPerDay = Math.max(0, limitPerDay);
      item.limit = totalLimit;
      item.todayRemaining = limitPerDay;
      return item;
    });
    const filter = await Promise.all(ordersPromises);
    return res.status(201).json({
      success: true,
      data: filter,
    });
  } catch (error) {
    res.status(501).json("Server Error", error);
  }
};

//SINGLE PRODUCT
const singleProduct = async (req, res) => {
  try {
    const { pId } = req.params;
    const productId = pId.toString();
    const product = await Product.findOne({ pId: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

//Through this function we anable the product and update the status to published
const toEnableProductOne = async (req, res) => {
  try {
    const { pId } = req.params;
    const singleProduct = await Product.findOneAndUpdate(
      { pId },
      { $set: { status: "published" } },
      { new: true },
    );
    if (!singleProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: singleProduct,
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Through this function we disable the product and update the status to disabled
const toDisableProduct = async (req, res) => {
  try {
    const { pId } = req.params;
    const singleProduct = await Product.findOneAndUpdate(
      { pId },
      { $set: { status: "disabled" } },
      { new: true },
    );
    if (!singleProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: singleProduct,
    });
  } catch (error) {
    // console.error("Error updating product status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.....................",
    });
  }
};

//ALL THOSE PRODUCTS WHICH ARE ENABLED IN THE DATABASE AND WILL SEND TO THE FRONTEND
const getAllEnabledProduct = async (req, res) => {
  try {
    const userId = req?.payload?._id;
    // const chineseSeller = req?.query?.chineseSeller
    const market = req?.query?.market;
    const categoryId = req?.query?.categoryId;
    const searchByKey = req?.query?.searchByKey;
    const productId = req?.query?.productId;
    const products = await Product.find({
      userId,
      status: "published",
      ...(productId ? { pId: productId } : {}),
      //  ...(chineseSeller ? {  } : {}),
      ...(market && market !== "ALL" ? { market } : {}),
      ...(categoryId && categoryId !== "65651988b7c6cf1ee7874e92"
        ? { categoryId }
        : {}),
      ...(searchByKey ? { keywords: searchByKey } : {}),
    }).sort({ pId: -1 });
    // console.log(products)
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
};

//ALL THOSE PRODUCTS WHICH ARE DISABLED IN THE DATABASE AND WILL SEND TO THE FRONTEND
const getAllDisabledProduct = async (req, res) => {
  try {
    const userId = req?.payload?._id;
    const market = req?.query?.market;
    const categoryId = req?.query?.categoryId;
    const searchByKey = req?.query?.searchByKey;
    const productId = req?.query?.productId;
    // const chineseSeller = req?.query?.chineseSeller

    const products = await Product.find({
      userId,
      status: "disabled",
      ...(productId ? { pId: productId } : {}),
      //  ...(chineseSeller ? {  } : {}),
      ...(market && market !== "ALL" ? { market } : {}),
      ...(categoryId && categoryId !== "65651988b7c6cf1ee7874e92"
        ? { categoryId }
        : {}),
      ...(searchByKey ? { keywords: searchByKey } : {}),
    }).sort({ pId: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const adminProducts = async (req, res) => {
  try {
    const admin = req?.payload?.role;
    const market = req.query.market;
    const productId = req.query.productId;
    if (admin === "admin") {
      const products = await Product.find({
        ...(productId ? { pId: productId } : {}),
        ...(market ? { market } : {}),
        status: { $in: ["published", "disabled", "enabled", "reserved"] },
      });
      res.status(200).json({ success: true, data: products });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const adminEnable = async (req, res) => {
  try {
    const pId = req?.params?.pId;
    await Product.findOneAndUpdate(
      { pId },
      { $set: { status: "disabled" } },
      { new: true },
    );
    res
      .status(200)
      .json({ success: true, message: "Product enabled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const adminDisable = async (req, res) => {
  try {
    const pId = req?.params?.pId;
    await Product.findOneAndUpdate(
      { pId },
      { $set: { status: "published" } },
      { new: true },
    );
    res
      .status(200)
      .json({ success: true, message: "Product disabled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addProduct,
  allProduct,
  singleProduct,
  toEnableProductOne,
  toDisableProduct,
  getAllDisabledProduct,
  getAllEnabledProduct,
  adminProducts,
  adminEnable,
  adminDisable,
};
