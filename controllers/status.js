const Status = require("../models/Status");

//Add Status
const addStatus = async (req, res) => {
  const { name } = req.body;
  const status = new Status({
    name,
  });
  await status.save();
  return res.status(200).json({
    success: true,
    message: "Status added successfully",
  });
};

//Get all Status
const getAllStatus = async (req, res) => {
  const allStatus = await Status.find({});
  return res.status(200).json({
    success: true,
    data: allStatus,
  });
};

//Delete Status
const deleteStatus = async (req, res) => {
  const { id } = req.params;
  const status = await Status.findById(id);
  if (!status) {
    return res.status(404).json({
      success: false,
      message: "Status not found.",
    });
  }
  await Status.deleteOne({ _id: id });
  res.status(200).json({
    success: true,
    message: `Status deleted successfully.`,
  });
};

module.exports = {
  addStatus,
  getAllStatus,
  deleteStatus,
};
