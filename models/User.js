const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "pmm", "pm"],
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    phone: {
      type: String,
    },
    cnic: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    profile: {
      type: String,
      default: "",
    },
    count: {
      type: Number,
      unique: true,
    },
    isEnable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.plugin(AutoIncrement, { inc_field: "count", start_seq: 100 });
module.exports = mongoose.model("users", userSchema);
