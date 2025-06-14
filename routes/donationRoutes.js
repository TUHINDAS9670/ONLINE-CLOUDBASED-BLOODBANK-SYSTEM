const express = require('express');
const router = express.Router();
const {
  createDonationRequest,
  updateDonationRequestStatus,
  getDonorDonationRequests,
  getOrganisationDonationRequests,
  updateDonationRequest,
  deleteDonationRequest,
  getDonorStats,getOrg
} = require('../controllers/donationController');
const {authMiddleware} = require('../middlewares/authMiddleware');

// Donor creates request
router.post('/request', authMiddleware, createDonationRequest);

// Donor views their requests
router.get('/my-requests', authMiddleware, getDonorDonationRequests);

// Organisation views all incoming requests
router.get('/incoming-requests', authMiddleware, getOrganisationDonationRequests);

// Organisation updates request status
router.put('/request/:id/status', authMiddleware, updateDonationRequestStatus);
router.put('/request/:id', authMiddleware, updateDonationRequest);
router.delete('/request/:id', authMiddleware, deleteDonationRequest);
//routes for donor's donation dashboard
router.get("/my-stats", authMiddleware, getDonorStats);
  router.post("/filter-orgs",authMiddleware, getOrg);


module.exports = router;