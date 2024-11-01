const {
  addCategory,
  getAllCategory,
  deleteCategory,
} = require("../controllers/category");

const route = require("express").Router();

route.post("/", addCategory);
route.get("/", getAllCategory);
route.delete("/:id", deleteCategory);

module.exports = route;
