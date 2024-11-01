const route = require("express").Router();
const {
  addMarket,
  getAllMarket,
  deleteMarket,
} = require("../controllers/market");

route.post("/", addMarket);
route.get("/", getAllMarket);
route.delete("/:id", deleteMarket);

module.exports = route;
