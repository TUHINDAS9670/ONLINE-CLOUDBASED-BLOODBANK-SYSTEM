const express = require('express');
const router = express.Router();
const {
  createHospitalRequest,
  updateHospitalRequestStatus,
  getHospitalRequests,
  getOrganisationHospitalRequests,
  updateHospitalRequest,
  deleteHospitalRequest,
} = require('../controllers/HospitalBloodRequestController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Hospital creates request
router.post('/request', authMiddleware, createHospitalRequest);

// Hospital views their own requests
router.post('/my-requests', authMiddleware, getHospitalRequests);

// Organisation views incoming hospital requests
router.post('/incoming-requests', authMiddleware, getOrganisationHospitalRequests);

// Organisation updates status
router.put('/request/:id/status', authMiddleware, updateHospitalRequestStatus);

// Hospital edits or deletes own request (if pending)
router.put('/request/:id', authMiddleware, updateHospitalRequest);
router.delete('/request/:id', authMiddleware, deleteHospitalRequest);

module.exports = router;
