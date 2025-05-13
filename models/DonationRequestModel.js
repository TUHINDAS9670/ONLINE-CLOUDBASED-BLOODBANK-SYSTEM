const mongoose = require("mongoose");

const donationRequestSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  bloodGroup: { type: String, required: true },
  quantity: { type: Number, required: true },
  disease: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("donationrequests", donationRequestSchema);
