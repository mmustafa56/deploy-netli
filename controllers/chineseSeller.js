const ChineseSeller = require("../models/ChineseSeller");

//Add ChineseSeller
const addChineseSeller = async (req, res) => {
  const { name } = req.body;
  const chineseSeller = new ChineseSeller({
    name,
  });
  await chineseSeller.save();
  return res.status(200).json({
    success: true,
    message: "ChineseSeller added successfully",
  });
};

//Get all ChineseSeller
const getAllChineseSeller = async (req, res) => {
  const allChineseSeller = await ChineseSeller.find({});
  return res.status(200).json({
    success: true,
    data: allChineseSeller,
  });
};

//Delete ChineseSeller
const deleteChineseSeller = async (req, res) => {
  const { id } = req.params;
  const chineseSeller = await ChineseSeller.findById(id);
  if (!chineseSeller) {
    return res.status(404).json({
      success: false,
      message: "ChineseSeller not found.",
    });
  }
  await ChineseSeller.deleteOne({ _id: id });
  res.status(200).json({
    success: true,
    message: `ChineseSeller deleted successfully.`,
  });
};

module.exports = {
  addChineseSeller,
  getAllChineseSeller,
  deleteChineseSeller,
};
