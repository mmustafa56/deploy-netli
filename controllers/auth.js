const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { createToken } = require("../utils/token");

//login
const login = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const isMatch = await bcryptjs.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(404).json({
      success: false,
      message: "Password is mismatch", ///It is not getting in the frontend.
    });
  }

  // console.log(user?.isEnable)
  if (user?.isEnable === false) {
    return res.status(404).json({
      success: false,
      message: "User is not enable.", ///It is not getting in the frontend.
    });
  }

  const token = createToken({ userId: user._id, email: user.email }); //this will generate the token
  user = user.toObject();
  delete user.password;
  return res.status(201).json({
    success: true,
    message: "User successfully logged In ",
    token,
    user,
  });
};

//Registeration
const register = async (req, res) => {
  const { name, password, email, role, address, cnic, city, phone, country } =
    req.body; //Here we will add District, state, country and phone
  const user = await User.findOne({ email });
  if (user) {
    return res.status(404).json({
      success: false,
      message: "User is already register!",
    });
  }
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);

  const create_User = new User({
    name,
    email,
    password: hash,
    role,
    cnic,
    address,
    city,
    country,
    phone,
  });

  const createUser = await create_User.save();
  if (createUser) {
    const token = createToken({
      userId: createUser._id,
      email: createUser.email,
    }); //this a function which generate the token
    let userData = createUser.toObject();
    delete userData.password;
    return res.status(200).json({
      user: userData,
      token,
      message: "user successfully register",
      success: true,
    });
  }
  return res.status(404).json("Invalid user data");
};

const allPMM = async (req, res) => {
  try {
    const name = req?.query?.name;
    const pmmId = req?.query?.pmmId;
    const user = await User.find({
      role: "pmm",
      ...(name ? { name: name } : {}),
      ...(pmmId ? { count: pmmId } : {}),
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(200).json({ success: false, message: "Server error:", error });
  }
};

const allPM = async (req, res) => {
  try {
    const name = req?.query?.name;
    const pmId = req?.query?.pmId;
    const user = await User.find({
      role: "pm",
      ...(name ? { name: name } : {}),
      ...(pmId ? { count: pmId } : {}),
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(200).json({ success: false, message: "Server error:", error });
  }
};

//
const allUser = async (req, res) => {
  try {
    // const name = req?.query?.name;
    // const userId = req?.query?.userId;
    // console.log(userId)
    const user = await User.find({
      //  ...(name?{name:name}:{}),
      //   ...(pmmId?{count:userId}:{}),
      $or: [{ role: "pm" }, { role: "pmm" }],
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(200).json({ success: false, message: "Server error:", error });
  }
};

// Update the value of isEnable is false to true
const updateEnable = async (req, res) => {
  const userId = req.query.userId;
  await User.findOneAndUpdate(
    { count: userId },
    { $set: { isEnable: false } },
    { new: true },
  );
  res
    .status(200)
    .json({ success: true, message: "User successfully Disabled." });
};

// Update the value of isEnable is true to false
const updateDisable = async (req, res) => {
  const userId = req.query.userId;
  await User.findOneAndUpdate(
    { count: userId },
    { $set: { isEnable: true } },
    { new: true },
  );
  res
    .status(200)
    .json({ success: true, message: "User successfully Enabled." });
};

//Delete user from the database
const deleteUser = async (req, res) => {
  try {
    const userId = req?.params?.userId;
    await User.deleteOne({ count: userId });
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  register,
  allPMM,
  allPM,
  allUser,
  updateDisable,
  updateEnable,
  deleteUser,
};
