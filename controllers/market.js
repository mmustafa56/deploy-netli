const Market = require("../models/Market");

//Add Market
const addMarket = async (req, res) => {
  const { name, shortName } = req.body;
  const market = new Market({
    name,
    shortName,
  });
  await market.save();
  return res.status(200).json({
    success: true,
    message: "Market added successfully",
  });
};

//Get all Market
const getAllMarket = async (req, res) => {
  const allMarget = await Market.find({});
  return res.status(200).json({
    success: true,
    data: allMarget,
  });
};

//Delete Market
const deleteMarket = async (req, res) => {
  const { id } = req.params;
  const market = await Market.findById(id);
  if (!market) {
    return res.status(404).json({
      success: false,
      message: "Market not found.",
    });
  }
  await Market.deleteOne({ _id: id });
  res.status(200).json({
    success: true,
    message: `Market deleted successfully.`,
  });
};

module.exports = {
  addMarket,
  getAllMarket,
  deleteMarket,
};
