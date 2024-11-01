const route = require("express").Router();
const {
  addChineseSeller,
  getAllChineseSeller,
  deleteChineseSeller,
} = require("../controllers/chineseSeller");

route.post("/", addChineseSeller);
route.get("/", getAllChineseSeller);
route.delete("/:id", deleteChineseSeller);

module.exports = route;
