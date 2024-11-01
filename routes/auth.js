const {
  login,
  register,
  allPMM,
  allPM,
  allUser,
  updateDisable,
  updateEnable,
  deleteUser,
} = require("../controllers/auth");
const updateProfile = require("../controllers/user");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../controllers/upload");
const updateUser = require("../controllers/updateUser");
const route = require("express").Router();

//ALL PMM &&  PM
route.get("/pmm", protect, allPMM);
route.get("/pm", protect, allPM);
route.get("/all", protect, allUser);
route.patch("/isDisable", updateDisable);
route.patch("/isEnable", updateEnable);

route.delete("/:userId", protect, deleteUser);
//Update Profile
route.get("/update", updateUser);

//Login && Registeration
route.post("/login", login);
route.post("/register", register);
route.put("/", protect, upload.single("profileImg"), updateProfile);

module.exports = route;
