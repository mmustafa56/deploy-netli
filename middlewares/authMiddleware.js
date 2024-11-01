const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token = req?.headers?.authorization?.split(" ")[1];
  // console.log(token,".............Token is null..........................")
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }
      req.payload = user;
      next();
      return null;
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ success: false, message: "Not authorized, token expired" });
    }
  } else {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

// const isPMM = async (req, res, next) => {

//     const {role} = req.payload
//    if(role ==="pmm"){
//       next();
//       return null;
//    }

//   return res.status(401).json({
//     success: false,
//     message: "your are not pmm",
//   });
// };

module.exports = { protect };
