const express = require("express");
const router = express.Router();
const { submitEmergencyRequest , updateEmergencyRequestStatusByAdmin,getAllEmergencyRequestsController,approveOrRejectByAdmin, getAdminPendingRequests, getOrgEmergencyRequestsController,updateRequestByOrganisation, getRequestByPatientId, getOrganisationHandledRequests} = require("../controllers/EmergencyRequestController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { isAdminOrOrg } = require("../middlewares/roleMiddleware"); // create this new file

// router.get("/all", authMiddleware, isAdminOrOrg, getAllEmergencyRequestsController);
// 
const multer = require("multer");
const upload = multer({ dest: "uploads/documents" });

router.post("/submit", upload.single("document"), submitEmergencyRequest);
router.put(
  "/admin/update-status/:id",
  authMiddleware,
  updateEmergencyRequestStatusByAdmin
);
router.get("/all",authMiddleware, getAllEmergencyRequestsController);
router.get("/handled-by-org/:userId",authMiddleware, getOrganisationHandledRequests);

// router.put("/admin/decision/:id", authMiddleware, approveOrRejectByAdmin);
router.post("/admin-pending", authMiddleware, getAdminPendingRequests);
router.post(
  "/organisation/view-requests",
  authMiddleware,
  getOrgEmergencyRequestsController
);
router.put("/organisation/update/:id",authMiddleware, updateRequestByOrganisation);


router.get("/get-by-patient-id/:patientId", getRequestByPatientId);


module.exports = router;

