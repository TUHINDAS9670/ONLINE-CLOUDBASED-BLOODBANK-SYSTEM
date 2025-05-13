const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  bloodGroup: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("donations", donationSchema);
