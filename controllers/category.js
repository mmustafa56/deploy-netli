const Category = require("../models/Category");

//Add category
const addCategory = async (req, res) => {
  const { name } = req.body;
  const category = new Category({
    name,
  });
  await category.save();
  return res.status(200).json({
    success: true,
    message: "Category added successfully",
  });
};

//Get all categories
const getAllCategory = async (req, res) => {
  const allCategory = await Category.find({});
  return res.status(200).json({
    success: true,
    data: allCategory,
  });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  }
  await Category.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: "Category deleted successfully.",
  });
};

module.exports = {
  addCategory,
  getAllCategory,
  deleteCategory,
};
