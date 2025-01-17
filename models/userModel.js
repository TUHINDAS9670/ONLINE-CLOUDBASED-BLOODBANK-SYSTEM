const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["admin", "organisation", "donor", "hospital"],
    },
    name: {
      type: String,
      required: function () {
        if (this.role === "user" || this.role === "admin") {
          return true;
        } else {
          return false;
        }
      },
    },
    organisation: {
      type: String,
      required: function () {
        if (this.role === "organisation") {
          return true;
        } else {
          return false;
        }
      },
    },
    hospitalName: {
      type: String,
      required: function () {
        if (this.role === "hospital") {
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
    address: {
      type: String,
      required: [true, "address is required"],
    },
    phone: {
      type: String,
      required: [true, "phone numberis required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
