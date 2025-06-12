// const mongoose = require("mongoose");

// const BloodRequestSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   bloodGroup: {
//     type: String,
//     required: true,
//   },
//   urgency: {
//     type: String,
//     enum: ["Low", "Moderate", "High", "Critical"],
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: [
//       "pending_admin",
//       "admin_approved",
//       "rejected_by_admin",
//       "accepted_by_org",
//       "rejected_by_org",
//       "fulfilled",
//     ],
//     default: "pending_admin",
//   },
//   approvedByAdmin: {
//     type: Boolean,
//     default: false,
//   },
//   approvedByOrganisation: {
//     type: Boolean,
//     default: false,
//   },
//   verified: {
//     type: Boolean,
//     default: false,
//   },
//   address: {
//     country: String,
//     state: String,
//     city: String,
//     location: String,
//     manualAddress: String, // ✅ add this line
//   },
//   documentUrl: {
//     type: String,
//     required: true,
//   },
//   patientId: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   requestTimestamp: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("BloodRequest", BloodRequestSchema);
const mongoose = require("mongoose");

const BloodRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  urgency: {
    type: String,
    enum: ["Low", "Moderate", "High", "Critical"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: [
      "pending_admin",
      "admin_approved",
      "rejected_by_admin",
      "accepted_by_org",
      "rejected_by_org",
      "fulfilled",
    ],
    default: "pending_admin",
  },

  approvedByAdmin: {
    type: Boolean,
    default: false,
  },
  approvedByOrganisation: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },

  address: {
    country: String,
    state: String,
    city: String,
    location: String,
    manualAddress: String,
  },

  documentUrl: {
    type: String,
    required: true,
  },

  patientId: {
    type: String,
    required: true,
    unique: true,
  },

  requestTimestamp: {
    type: Date,
    default: Date.now,
  },

  // ✅ New fields for real-time tracking
  handledBy: {
    name: String,
    contact: String,
    email: String,
  },

  responseETA: {
    type: String, // e.g., "Within 4 hours"
  },

  trackingHistory: [
    {
      status: String, // like "pending_admin", "admin_approved", etc.
      timestamp: Date,
      message: String, // Optional message/log for status update
    },
  ],
});

module.exports = mongoose.model("BloodRequest", BloodRequestSchema);
