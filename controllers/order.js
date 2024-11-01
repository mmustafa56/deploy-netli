const Order = require("../models/Order");
const Product = require("../models/Product");
const Market = require("../models/Market");
const Status = require("../models/Status");

//Create order
const createOrder = async (req, res) => {
  try {
    const { pId, paypal, buyerContact, orderNumber, remark, market } = req.body;
    const myFile = req.files;
    const orderScreenshot =
      process.env.baseUrl + "/images/" + myFile?.orderScreenshot[0]?.filename;
    const refundScreenshot = "";
    const userId = req.payload._id;
    const product = await Product.findOne({ pId: pId });
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });
    }
    await Product.findOneAndUpdate(
      { pId: pId },
      { $set: { limitPerDay: product?.limitPerDay - 1 } },
    );
    const order = new Order({
      userId,
      productId: product._id,
      orderNumber,
      paypal,
      market,
      buyerContact,
      remark,
      refundScreenshot,
      orderScreenshot,
      reviewScreenshot: "",
      status: "Ordered",
      orderDate: "",
      reviewDate: "",
      refundDate: "",
    });
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order added successfully.",
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      message: "Order added successfully.",
    });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  const { pId } = req.params;
  const order = await Order.findOne({ pId });
  if (!order) {
    return res.status(400).json({
      success: false,
      message: "Order not found",
    });
  }
  await Order.deleteOne({ pId });
  res.status(200).json({
    success: true,
    message: "Order deleted successfully.",
  });
};

// //GET Single order to menage with it////
const singleOrder = async (req, res) => {
  try {
    let { orderId } = req.params;
    const order = await Order.find({ orderId })
      .populate("productId")
      .populate("market")
      .populate("userId");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "No order found." });
    }
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get Order
const orders = async (req, res) => {
  const userId = req.payload._id;
  try {
    const status = req?.query?.status;
    const customerEmail = req?.query?.customerEmail;
    const orderNumber = req?.query?.orderNumber;
    const searchById = req?.query?.searchById;
    const product = await Product.findOne({ pId: searchById });
    const order = await Order.find({
      ...(status && status !== "All" ? { status } : {}),
      ...(customerEmail ? { paypal: customerEmail } : {}),
      ...(searchById ? { productId: product?._id } : {}),
      ...(orderNumber ? { orderNumber } : {}),
    })
      .populate("productId")
      .populate("userId")
      .populate("market");

    const filteredOrders = order.filter((singleOrder) => {
      return (
        singleOrder.userId._id.toHexString() === userId.toHexString() ||
        singleOrder.productId.userId.toHexString() === userId.toHexString()
      );
    });

    res.status(200).json({
      success: true,
      data: filteredOrders,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: `Server error: ${error}`,
    });
  }
};

///This is for admin
const completedOrder = async (req, res) => {
  try {
    const userRole = req.payload.role;
    if (userRole === "admin") {
      const order = await Order.find({ status: "ordercompleted" });
      res.status(200).json({ success: true, data: order });
    } else {
      res
        .status(400)
        .json({ success: false, message: "You are going on wrong track." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: `Server Error: ${error}` });
  }
};

//When order is updated
const updatedOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      productId,
      customerEmail,
      facebookIdentity,
      status,
      remark,
      market,
    } = req.body;
    const product = await Product.findOne({ pId: productId });
    const marketObject = await Market.find({ shortName: market });
    const statusBack = await Status.find({ _id: status });
    const order = await Order.findOneAndUpdate(
      { productId: product._id },
      {
        orderNumber,
        productId: product._id,
        paypal: customerEmail,
        buyerContact: facebookIdentity,
        status: statusBack[0]?.name,
        remark,
        market: marketObject[0]?._id,
      },
      { new: true },
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, message: "Updated successfully." });
  } catch (error) {
    // console.error(error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};

//When order status is change
const statusChange = async (req, res) => {
  const { statusModel, ordernumber } = req.body.values;
  try {
    const status = await Status.findById(statusModel);
    if (!status) {
      return res
        .status(404)
        .json({ success: false, message: "Status not selected" });
    }
    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber: ordernumber },
      { $set: { status: status.name } },
      { new: true },
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Order status updated successfully",
        order: updatedOrder,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` });
  }
};

const orderPic = async (req, res) => {
  try {
    const orderNumber = req.body.orderNumber;
    const path = req.file;
    const screenShot = process.env.baseUrl + "/images/" + path?.filename;
    await Order.findOneAndUpdate(
      { orderNumber },
      { orderScreenshot: screenShot },
      { new: true },
    );
    res
      .status(200)
      .json({ success: true, message: "Order Picture updated successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` });
  }
};

const refundPic = async (req, res) => {
  try {
    const orderNumber = req.body.orderNumber;
    const path = req.file;
    const screenShot = process.env.baseUrl + "/images/" + path?.filename;
    await Order.findOneAndUpdate(
      { orderNumber },
      { refundScreenshot: screenShot },
      { new: true },
    );
    res
      .status(200)
      .json({ success: true, message: "Order Picture updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

const reviewPic = async (req, res) => {
  try {
    const orderNumber = req.body.orderNumber;
    const path = req.file;
    const screenShot = process.env.baseUrl + "/images/" + path?.filename;
    await Order.findOneAndUpdate(
      { orderNumber },
      { reviewScreenshot: screenShot },
      { new: true },
    );
    res
      .status(200)
      .json({ success: true, message: "Order Picture updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

const adminDashboardOrder = async (req, res) => {
  try {
    const role = req?.payload?.role;
    const market = req?.query?.market;
    const orderId = req?.query?.orderId; ///orderNumber is equal to orderId
    const marketId = await Market.findOne({ shortName: market });
    if (role === "admin") {
      const allOrder = await Order.find({
        ...(market ? { market: marketId?._id } : {}),
        ...(orderId ? { orderId } : {}),
      })
        .populate("productId")
        .populate("userId")
        .populate("market");
      res.status(200).json({ success: true, data: allOrder });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
};

module.exports = {
  createOrder,
  deleteOrder,
  orders,
  singleOrder,
  completedOrder,
  updatedOrder,
  statusChange,
  orderPic,
  refundPic,
  reviewPic,
  adminDashboardOrder,
};
