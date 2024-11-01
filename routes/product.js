const route = require("express").Router();
const {
  allProduct,
  singleProduct,
  addProduct,
  toEnableProductOne,
  toDisableProduct,
  getAllEnabledProduct,
  getAllDisabledProduct,
  adminProducts,
  adminDisable,
  adminEnable,
} = require("../controllers/product");
const upload = require("../controllers/upload");
const { protect } = require("../middlewares/authMiddleware");

route.put("/admin/enable/:pId", protect, adminEnable); //for admin only
route.get("/admin", protect, adminProducts); //For admin only
route.put("/admin/disable/:pId", protect, adminDisable); //for admin only

//All enable and disable prodcut for PMM
route.get("/disabled", protect, getAllDisabledProduct);
route.get("/enabled", protect, getAllEnabledProduct);

//All product for PM
route.get("/", protect, allProduct);

//PMM can enable and disable a product.
route.put("/enable/:pId", protect, toEnableProductOne);
route.put("/disable/:pId", protect, toDisableProduct);

//PMM Create Product
route.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "screenShot", maxCount: 1 },
  ]),
  addProduct,
);

route.get("/:pId", protect, singleProduct);

module.exports = route;
