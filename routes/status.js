const route = require("express").Router();
const {
  addStatus,
  getAllStatus,
  deleteStatus,
} = require("../controllers/status");

route.post("/", addStatus);
route.get("/", getAllStatus);
route.delete("/:id", deleteStatus);

module.exports = route;
