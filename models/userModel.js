const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["Admin", "Organisation", "Donor", "Hospital"],
    },
    name: {
      type: String,
      required: function () {
        if (this.role === "User" || this.role === "Admin") {
          return true;
        } else {
          return false;
        }
      },
    },
    organisationName: {
      type: String,
      required: function () {
        if (this.role === "Organisation") {
          return true;
        } else {
          return false;
        }
      },
    },
    hospitalName: {
      type: String,
      required: function () {
        if (this.role === "Hospital") {
          return true;
        } else {
          return false;
        }
      },
    },
    email: {
      type: String,
      require: [true, "emailis required"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "password is required"],
    },
    location: {
      type: String,
      required: [true, "address is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
