const express = require('express');
const router = express.Router();
const {
  getNearbyEmergencyRequests,
  expressDonorInterest,
  withdrawDonorInterest,
  getDonorEmergencyCommitments
} = require('../controllers/emergencydonorController');
const {authMiddleware} = require('../middlewares/authMiddleware');


// Donor gets nearby emergency requests based on location
router.post('/donor/nearby',authMiddleware, getNearbyEmergencyRequests);

// Donor expresses interest in an emergency request
router.post('/donor/interest',authMiddleware, expressDonorInterest);

// Donor withdraws interest
router.delete('/donor/interest/:id',authMiddleware, withdrawDonorInterest);

// Donor gets their committed requests
router.get('/donor/commitments',authMiddleware, getDonorEmergencyCommitments);

module.exports = router;
