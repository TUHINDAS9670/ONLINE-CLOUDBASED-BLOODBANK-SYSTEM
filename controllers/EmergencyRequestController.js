// controllers/emergencyRequestController.js
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const EmergencyRequest = require("../models/EmergencyRequestModel");
const User = require("../models/userModel");
const { sendApprovalEmail, sendEmergencyRequestCreatedEmail, sendAdminDecisionEmail, sendAdminRejectionEmail, sendAdminApprovalEmail, sendRejectionEmail } = require("../utils/sendMail");


const submitEmergencyRequest = async (req, res) => {
  try {
    const { fullName, email, phone, bloodGroup, urgency, quantity } = req.body;

    const address = JSON.parse(req.body.address);

    if (!address || !address.country || !address.state || !address.city) {
      return res
        .status(400)
        .json({ success: false, message: "Incomplete address details." });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Document is required." });
    }

    const patientId = uuidv4();
    const ext = path.extname(req.file.originalname); // .pdf, .jpg, etc.
    const fileName = `${uuidv4()}${ext}`;
    const destPath = path.join("uploads", "documents", fileName);

    // Rename/move file from temp location to final destination
    fs.renameSync(req.file.path, destPath);
    // Assuming you're using Mongoose and have imported your model
    const lastRequest = await EmergencyRequest.findOne({
      email: req.body.email,
      phone: req.body.phone,
    }).sort({ requestTimestamp: -1 });

    if (lastRequest) {
      const now = new Date();
      const lastTime = new Date(lastRequest.requestTimestamp);
      const hoursSince = (now - lastTime) / (1000 * 60 * 60); // convert ms to hours

      if (hoursSince < 48) {
        return res.status(400).json({
          success: false,
          message: `You can only submit one request every 48 hours. Please try again in ${Math.ceil(
            48 - hoursSince
          )} hour(s).`,
        });
      }
    }

    const newRequest = new EmergencyRequest({
      patientId,
      fullName,
      email,
      phone,
      bloodGroup,
      urgency,
      quantity,
      address,
      documentUrl: destPath.replace(/\\/g, "/"), // Store as forward slashes for URL compatibility
      createdAt: new Date(),
    });

    await newRequest.save();


    res
      .status(200)
      .json({
        success: true,
        message: "Emergency request submitted.",
        patientId,
      });
      await sendEmergencyRequestCreatedEmail(email, fullName, bloodGroup, quantity, urgency, address);

  } catch (err) {
    console.error("Emergency request error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Try again later." });
  }
};

// const updateEmergencyRequestStatusByAdmin = async (req, res) => {
//   try {
//     const { status, adminRemarks } = req.body;

//     if (!["admin_approved", "rejected_by_admin"].includes(status)) {
//       return res.status(400).send({ success: false, message: "Invalid status for admin" });
//     }

//     const request = await EmergencyRequest.findByIdAndUpdate(
//       req.params.id,
//       { status, adminRemarks, approvedByAdmin: status === "admin_approved" },
//       { new: true }
//     );

//     if (!request) {
//       return res.status(404).send({ success: false, message: "Request not found" });
//     }

//     res.status(200).send({ success: true, message: "Admin status updated", data: request });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, message: "Server error" });
//   }
// };

// controllers/emergencyRequestController.js
const updateEmergencyRequestStatusByAdmin = async (req, res) => {
  try {
    const { userId, status, adminRemarks } = req.body;


    const user = await User.findById(userId);
    if (!user || user.role !== "Admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only admins can update request status",
        });
    }

    if (!["admin_approved", "rejected_by_admin"].includes(status)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid status for admin" });
    }

    const request = await EmergencyRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminRemarks, approvedByAdmin: status === "admin_approved" },
      { new: true }
    );

    if (!request) {
      return res
        .status(404)
        .send({ success: false, message: "Request not found" });
    }

    res
      .status(200)
      .send({ success: true, message: "Admin status updated", data: request });
if (status === "admin_approved") {
  await sendAdminApprovalEmail(
    request.email,
    request.fullName,
    request.bloodGroup,
    request.quantity,
    status,
    adminRemarks
  );
} else if (status === "rejected_by_admin") {
  await sendAdminRejectionEmail(
    request.email,
    request.fullName,
    request.bloodGroup,
    request.quantity,
    status,
    adminRemarks
  );
}


  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
};

const getAllEmergencyRequestsController = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const approveOrRejectByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminRemarks } = req.body;

    const user = await User.findById(req.body.userId); // 🔥 this is the key line
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Admins only." });
    }

    const validActions = ["approve", "reject"];
    if (!validActions.includes(action)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    const updatedFields =
      action === "approve"
        ? { status: "admin_approved", approvedByAdmin: true }
        : { status: "rejected_by_admin", approvedByAdmin: false };

    const updatedRequest = await EmergencyRequest.findByIdAndUpdate(
      id,
      { ...updatedFields, adminRemarks: adminRemarks || "" },
      { new: true }
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: `Request ${action}ed by admin`,
      data: updatedRequest,
    });
  } catch (err) {
    console.error("Admin approval error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// const updateRequestByOrganisation = async (req, res) => {
//   try {
//     // const { userRole } = req.body;
//     const user = await User.findById(req.body.userId);
// if (!user || user.role !== "Organisation") {
//       return res.status(403).json({ success: false, message: "Only organisations can perform this action." });
//     }

//     const { status, orgRemarks } = req.body;
//     const request = await EmergencyRequest.findByIdAndUpdate(
//       req.params.id,
//       {
//         status,
//         approvedByOrganisation: status === "accepted_by_org"
//       },
//       { new: true }
//     );

//     if (!request) {
//       return res.status(404).send({ success: false, message: "Request not found" });
//     }

//     res.status(200).send({ success: true, message: "Request updated", data: request });
//   } catch (error) {
//     console.error("Organisation request update error:", error);
//     res.status(500).send({ success: false, message: "Server error" });
//   }
// };

// const getAdminPendingRequests = async (req, res) => {
//   try {
// const userId = req.body.userId;
// const user = await User.findById(userId);
//     if (!user || user.role !== "Admin") {
//       return res.status(403).json({ success: false, message: "Access denied: Admins only" });
//     }

//     const requests = await EmergencyRequest.find({ status: "pending_admin" }).sort({ createdAt: -1 });
//     res.status(200).json({ success: true, requests });
//   } catch (error) {
//     console.error("Error fetching admin pending requests:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
const { Country, State, City } = require("country-state-city");

const getAdminPendingRequests = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user || user.role !== "Admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Admins only" });
    }

    let requests = await EmergencyRequest.find({
      status: "pending_admin",
    }).sort({ createdAt: -1 });

    // 🛠️ Map and transform address codes to names
    requests = requests.map((req) => {
      const countryName =
        Country.getCountryByCode(req.address?.country)?.name ||
        req.address?.country;
      const stateName =
        State.getStateByCodeAndCountry(req.address?.state, req.address?.country)
          ?.name || req.address?.state;
      const cityName = req.address?.city || "";

      return {
        ...req._doc,
        address: {
          country: countryName,
          state: stateName,
          city: cityName,
          manualAddress: req.address?.manualAddress || "",
        },
      };
    });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching admin pending requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all approved requests in same state or country

// const getOrgEmergencyRequestsController = async (req, res) => {
//   try {
//    const userId = req.body.userId; // ✅ FIXED: use authenticated user
//     const user = await User.findById(userId);
//     if (!user || user.role !== "Organisation") {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }

// const stateName = user.location.state; // already stored as code
// const countryName = user.location.country;

//     if (!stateName || !countryName) {
//       return res.status(400).json({ success: false, message: "Invalid address data in profile" });
//     }

//     const requests = await EmergencyRequest.find({
//       $or: [
//         { "address.state": stateName },
//         { "address.country": countryName },
//       ],
//       status: "admin_approved"
//     }).sort({ createdAt: -1 });

//     res.status(200).json({ success: true, requests });
//   } catch (err) {
//     console.error("Org view error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
const getOrgEmergencyRequestsController = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (!user || user.role !== "Organisation") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const stateCode = user.location?.state;
    const countryCode = user.location?.country;
    const cityCode = user.location?.city;

    if (!stateCode || !countryCode ||!cityCode) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Incomplete organisation location info",
        });
    }

    const requests = await EmergencyRequest.find({
      status: "admin_approved",
      $or: [
        { "address.state": stateCode },
        { "address.country": countryCode },
        { "address.city": cityCode }
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error("Org view error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const updateRequestByOrganisation = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const { id } = req.params;

    const user = await User.findById(userId);
    if (!user || user.role !== "Organisation") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only organisations can perform this action.",
        });
    }
console.log(user)
    if (!["accepted_by_org", "rejected_by_org"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status for organisation." });
    }

    const updatedRequest = await EmergencyRequest.findByIdAndUpdate(
      id,
      {
        status,
        approvedByOrganisation: status === "accepted_by_org",
        updatedBy: userId, 
        
      },
      { new: true }
    );
    
 if (status === "accepted_by_org") {
  updatedRequest.handledBy = {
  name: user.organisationName,
  contact: user.phoneNumber,
  email: user.email,
  address:user.location.full
};

await updatedRequest.save();

 const orgDetails = {
    name: user.organisationName,
    contact: user.phoneNumber,
  email: user.email,
  address: user.location,
    
  };

  await sendApprovalEmail(
    updatedRequest.email,
    updatedRequest.fullName,
    updatedRequest.patientId,
    orgDetails,
  );
}
 if (status === "rejected_by_org") {
  updatedRequest.handledBy = {
  name: user.organisationName,
  contact: user.phoneNumber,
  email: user.email,
  address:user.location.full
};

await updatedRequest.save();

 const orgDetails = {
    name: user.organisationName,
    contact: user.phoneNumber,
  email: user.email,
  address: user.location,
    
  };

  await sendRejectionEmail(
    updatedRequest.email,
    updatedRequest.fullName,
    updatedRequest.patientId,
    orgDetails,
  );
}


    if (!updatedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Request status updated by organisation",
        data: updatedRequest,
      });
  } catch (error) {
    console.error("Organisation request update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getOrganisationHandledRequests = async (req, res) => {
  try {
const userId = req.params.userId; 

    const user = await User.findById(userId).lean();
    if (!user || user.role !== "Organisation") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access: Invalid organisation ID",
      });
    }

    const requests = await EmergencyRequest.find({
      status: { $in: ["accepted_by_org", "rejected_by_org"] },
      "handledBy.email": user.email,
    }).lean();

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching organisation-handled requests:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching requests",
    });
  }
};



const getRequestByPatientId = async (req, res) => {
  const { patientId } = req.params;

  const request = await EmergencyRequest.findOne({ patientId });
  if (!request) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  res.status(200).json({ success: true, request });
};

module.exports = {
  submitEmergencyRequest,
  updateEmergencyRequestStatusByAdmin,
  getAllEmergencyRequestsController,
  approveOrRejectByAdmin,
  updateRequestByOrganisation,
  getAdminPendingRequests,
  getOrgEmergencyRequestsController,
  getRequestByPatientId,
  getOrganisationHandledRequests,
};
