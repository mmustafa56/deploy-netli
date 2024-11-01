const route = require("express").Router();
const {
  reservedAProduct,
  getReservedProduct,
  releaseReserved,
} = require("../controllers/reserve");
const { protect } = require("../middlewares/authMiddleware");

route.delete("/:pId", protect, releaseReserved);
route.post("/:pId", protect, reservedAProduct);
route.get("/", protect, getReservedProduct);

module.exports = route;
