import mongoose from "mongoose";

const bloodRequestHistorySchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true, // generated token for tracking
    },
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      location: { type: String, required: true },
      full: { type: String, required: true },
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    urgency: {
      type: String,
      enum: ["Urgent", "Within 24 hours", "Within 48 hours"],
      required: true,
    },
    hospitalDocument: {
      type: String, // file URL or base64
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastRequestAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BloodRequestHistory", bloodRequestHistorySchema);
