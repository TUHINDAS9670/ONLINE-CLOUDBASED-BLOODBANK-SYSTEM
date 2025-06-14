const mongoose = require('mongoose');

const emergencyDonorInterestSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmergencyRequest',
    required: true,
  },
  status: {
    type: String,
    enum: ['interested', 'accepted', 'completed', 'withdrawn'],
    default: 'interested',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('EmergencyDonorInterest', emergencyDonorInterestSchema);
