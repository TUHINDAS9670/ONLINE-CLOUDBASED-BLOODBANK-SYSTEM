const EmergencyDonorInterest = require('../models/EmergencyDonorInterestModel');
const EmergencyRequest = require('../models/EmergencyRequestModel');
const User = require('../models/userModel');

// Get requests near donor (same state/city)
const getNearbyEmergencyRequests = async (req, res) => {
  try {
    const userId = req.body.userId || req.user._id; // based on your auth middleware
    const user = await User.findById(userId);
    
    if (!user || user.role !== "Donor") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const state = user.location?.state;
    const country = user.location?.country;

    if (!state || !country) {
      return res.status(400).json({
        success: false,
        message: "Incomplete donor location data",
      });
    }

    const requests = await EmergencyRequest.find({
      status: "admin_approved", // 🔐 Only approved requests
      $or: [
        { "address.state": state },
        { "address.country": country },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching donor nearby requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Donor expresses interest
const expressDonorInterest = async (req, res) => {
  try {
    const { donorId, requestId } = req.body;

    const existing = await EmergencyDonorInterest.findOne({ donorId, requestId });
    if (existing) {
      return res.status(400).json({ message: 'Already expressed interest' });
    }

    const interest = await EmergencyDonorInterest.create({ donorId, requestId });
    res.status(201).json({ message: 'Interest submitted', interest });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Donor withdraws interest
const withdrawDonorInterest = async (req, res) => {
  try {
    const { donorId } = req.body;
    const { id } = req.params;

    const interest = await EmergencyDonorInterest.findOne({ _id: id, donorId });

    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    await EmergencyDonorInterest.findByIdAndDelete(id);
    res.status(200).json({ message: 'Interest withdrawn' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get donor commitments
const getDonorEmergencyCommitments = async (req, res) => {
  try {
    const { userId } = req.body;

    const interests = await EmergencyDonorInterest.find({ donorId: userId })
      .populate('requestId');

    const result = interests.map((item) => ({
      interestId: item._id,
      requestId: item.requestId._id,
      bloodGroup: item.requestId.bloodGroup,
      city: item.requestId.address?.city || '',
      status: item.status
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
  getNearbyEmergencyRequests,
  expressDonorInterest,
  withdrawDonorInterest,
  getDonorEmergencyCommitments
};
