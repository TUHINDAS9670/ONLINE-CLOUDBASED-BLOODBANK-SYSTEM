const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
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
  bloodGroup: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("bloodrequests", bloodRequestSchema);
