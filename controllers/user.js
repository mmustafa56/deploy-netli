const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.payload._id },
      {
        $set: {
          profile: process.env.baseUrl + "/images/" + req.file?.filename,
        },
      },
    );

    const user = await User.find({ email: req.payload.email }).select(
      "-password",
    );
    return res.status(200).json({
      success: true,
      data: user,
      message: "profile updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

// const updateProfile = async (req, res) => {
//   const userId = req.payload._id
//   try {
//     await User.updateOne({_id:userId},
//       {
//         $set: { profile: process.env.baseUrl + "/images/" + req.file?.filename},
//       },
//     );

//     const user = await User.find({ email : req.payload.email }).select(
//       "-password",
//     );
//     return res.status(200).json({
//       success: true,
//       data: user,
//       message: "profile updated successfully",
//     });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//       error,
//     });
//   }
// };

module.exports = updateProfile;
