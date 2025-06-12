// backend/models/notificationModel.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ['Donor', 'Organisation', 'Hospital', 'Admin'],
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientType',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String, // e.g. /emergency-requests/123
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    relatedRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmergencyRequest', // or another relevant model
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
