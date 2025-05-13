const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true }, // now included
  location: { type: String, required: true }, // full address: street, house no.
  full: { type: String, required: true } // concatenated full address
});

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["Admin", "Organisation", "Donor", "Hospital"],
    },
    // name: {
    //   type: String,
    //   required: function () {
    //     return ["Admin", "Donor"].includes(this.role);
    //   },
    // },
    
    name: {
      type: String,
      required: function () {
        if (this.role === "User" || this.role === "Admin"||this.role==="Donor") {
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
      required: [true, "emailis required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
    },
    bloodGroup: {
      type: String,
      required: function () {
        return this.role === "Donor";
      },
    },
    location: { type: addressSchema, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
