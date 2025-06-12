const mongoose = require("mongoose");

const hospitalRequestSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
       hospitalName: {
      type: String, // ✅ Add this field
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    remarks: {
  type: String,
  default: "",
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("HospitalRequest", hospitalRequestSchema);
