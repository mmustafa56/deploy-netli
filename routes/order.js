const route = require("express").Router();
const {
  deleteOrder,
  createOrder,
  updatedOrder,
  orders,
  singleOrder,
  completedOrder,
  statusChange,
  orderPic,
  refundPic,
  reviewPic,
  adminDashboardOrder,
} = require("../controllers/order");
const upload = require("../controllers/upload");
const { protect } = require("../middlewares/authMiddleware");

route.get("/", protect, orders);
route.patch("/update", protect, updatedOrder); //////for both pmm and pm
route.patch("/status", protect, statusChange); ////////for both pmm and pm
route.get("/complete", protect, completedOrder); //////////For Admin Only
route.get("/admin/allDashboard", protect, adminDashboardOrder); ////////For Admin Only
route.post(
  "/",
  protect,
  upload.fields([
    { name: "refundScreenshot", maxCount: 1 },
    { name: "orderScreenshot", maxCount: 1 },
  ]),
  createOrder,
); //for pm only

route.put(
  "/upload/ordered",
  protect,
  upload.single("orderScreenshot"),
  orderPic,
); //for both pmm and pm
route.put(
  "/upload/review",
  protect,
  upload.single("reviewScreenshot"),
  reviewPic,
); //for pm only
route.put(
  "/upload/refund",
  protect,
  upload.single("refundScreenshot"),
  refundPic,
); //for pmm only
route.delete("/:id", protect, deleteOrder); //it might be for admin or other
route.get("/:orderId", protect, singleOrder);

module.exports = route;
