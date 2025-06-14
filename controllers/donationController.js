// const DonationRequest = require('../models/DonationRequestModel');
// const Inventory = require('../models/InventoryModel');
// const User = require('../models/userModel');
// const { createInventoryController } = require("./inventoryController");
// // Donor submits donation request
// const createDonationRequest = async (req, res) => {
//   try {
//     const donorId = req.body.userId;
//     const { organisationId, bloodGroup, quantity , disease } = req.body;

//     const organisation = await User.findById(organisationId);
//     if (!organisation || organisation.role !== 'Organisation') {
//       return res.status(400).json({ message: 'Invalid organisation' });
//     }

//     const request = await DonationRequest.create({
//       donor: donorId,
//       organisation: organisationId,
//       bloodGroup,
//       quantity,disease
//     });

//     res.status(201).json({ message: 'Donation request submitted', request });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // Organisation updates request status
// const updateDonationRequestStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!['approved', 'rejected'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     const request = await DonationRequest.findById(id).populate('donor organisation');
//     if (!request) return res.status(404).json({ message: 'Request not found' });

//     request.status = status;
//     await request.save();

//     // If approved, add to inventory
//     if (status === 'approved') {
//       await Inventory.create({
//         inventoryType: 'in',
//         donor: request.donorId,
//         organisation: request.organisation._id,
//         bloodGroup: request.bloodGroup,
//         quantity: request.quantity
//       });
//     }

//     res.status(200).json({ message: 'Request updated', request });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // Donor views their donation request history
// const getDonorDonationRequests = async (req, res) => {
//   try {

//     // const donorId = req.user._id;
//     const donorId=req.body.userId;
//     const requests = await DonationRequest.find({ donor: donorId }).populate('organisation', 'organisationName email');
//     res.status(200).json(requests);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // Organisation views incoming donation requests
// const getOrganisationDonationRequests = async (req, res) => {
//   try {
//     const orgId = req.body.userId;
//     const requests = await DonationRequest.find({ organisation: orgId }).populate('donor', 'name email');
//     res.status(200).json(requests);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };
// const deleteDonationRequest = async (req, res) => {
//   try {
//     const donorId = req.body.userId;
//     const { id } = req.params;

//     const request = await DonationRequest.findOne({ _id: id, donor: donorId });

//     if (!request) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     if (request.status !== "pending") {
//       return res.status(400).json({ message: "Cannot delete a processed request" });
//     }

//     await DonationRequest.findByIdAndDelete(id);
//     res.status(200).json({ message: "Request deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };
// const updateDonationRequest = async (req, res) => {
//   try {
//     const donorId =req.body.userId;
//     const { id } = req.params;
//     const { quantity, disease, organisationId } = req.body;

//     const request = await DonationRequest.findOne({ _id: id, donor: donorId });

//     if (!request) return res.status(404).json({ message: "Request not found" });

//     if (request.status !== "pending") {
//       return res.status(400).json({ message: "Cannot edit a processed request" });
//     }

//     request.quantity = quantity;
//     request.disease = disease;
//     request.organisation = organisationId;

//     await request.save();
//     res.status(200).json({ message: "Request updated successfully", request });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // getDonorStats for controlling donor requests dashboard
// const getDonorStats = async (req, res) => {
//   try {
//     const donorId = req.body.userId;

//     const total = await DonationRequest.countDocuments({ donor: donorId });
//     const approved = await DonationRequest.countDocuments({ donor: donorId, status: 'approved' });
//     const rejected = await DonationRequest.countDocuments({ donor: donorId, status: 'rejected' });

//     res.status(200).json({
//       total,
//       approved,
//       rejected,
//       donated: approved // same as approved
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// module.exports = {
//   createDonationRequest,
//   updateDonationRequestStatus,
//   getDonorDonationRequests,
//   getOrganisationDonationRequests,
//   deleteDonationRequest,
//   updateDonationRequest,
//   getDonorStats
// };

const DonationRequest = require("../models/DonationRequestModel");
const { sendDonationRejectionEmail } = require("../utils/sendMail");
const { createInventoryController } = require("./inventoryController");

// Donor submits donation request
// const createDonationRequest = async (req, res) => {
//   try {
//     const donorId = req.body.userId;
//     const { organisationId, bloodGroup, quantity, disease } = req.body;

//     const organisation = await User.findById(organisationId);
//     if (!organisation || organisation.role !== 'Organisation') {
//       return res.status(400).json({ message: 'Invalid organisation' });
//     }

//     const request = await DonationRequest.create({
//       donor: donorId,
//       organisation: organisationId,
//       bloodGroup,
//       quantity,
//       disease
//     });
// await sendEmail({
//       to: donor.email,
//       subject: "Blood Donation Request Submitted",
//       text: `Hi ${donor.name},\n\nYour request to donate ${quantity}ml of ${bloodGroup} has been submitted to ${organisation.organisationName}. You will be notified once it's reviewed.\n\nThank you!`
//     });
//     res.status(201).json({ message: 'Donation request submitted', request });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }

// };
const {
  sendDonationConfirmationEmail,
  sendDonationApprovalEmail,
} = require("../utils/sendMail"); // ✅ correct import
const userModel = require("../models/userModel");

const createDonationRequest = async (req, res) => {
  try {
    const donorId = req.body.userId;
    const { organisationId, bloodGroup, quantity, disease } = req.body;

    const organisation = await User.findById(organisationId);
    if (!organisation || organisation.role !== "Organisation") {
      return res.status(400).json({ message: "Invalid organisation" });
    }

    const donor = await User.findById(donorId);
    if (!donor || donor.role !== "Donor") {
      return res.status(400).json({ message: "Invalid donor" });
    }

    const request = await DonationRequest.create({
      donor: donorId,
      organisation: organisationId,
      bloodGroup,
      quantity,
      disease,
    });

    await sendDonationConfirmationEmail(
      donor.email,
      donor.name,
      quantity,
      bloodGroup,
      organisation.organisationName
    );

    res.status(201).json({ message: "Donation request submitted", request });
  } catch (error) {
    console.error("Error submitting donation request:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Organisation updates request status
// const updateDonationRequestStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!['approved', 'rejected'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     const request = await DonationRequest.findById(id).populate('donor organisation');
//     if (!request) return res.status(404).json({ message: 'Request not found' });

//     request.status = status;
//     await request.save();

//     // If approved, use centralized inventory creation
//     if (status === 'approved') {
//       const inventoryReq = {
//         body: {
//           email: request.donor.email,
//           userId: request.organisation._id.toString(),
//           bloodGroup: request.bloodGroup,
//           quantity: request.quantity,
//           inventoryType: "in",
//           disease: request.disease || "",
//           organisation: request.organisation._id
//         }
//       };

//       // Use a dummy res object to suppress internal responses
//       await createInventoryController(inventoryReq, {
//         status: () => ({ send: () => {} })
//       });
//     }

//     res.status(200).json({ message: 'Request updated', request });
//   } catch (error) {
//     console.error("Approval Error:", error);
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

const updateDonationRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await DonationRequest.findById(id).populate(
      "donor organisation"
    );
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    if (status === "approved") {
      // Add to inventory
      const inventoryReq = {
        body: {
          email: request.donor.email,
          userId: request.organisation._id.toString(),
          bloodGroup: request.bloodGroup,
          quantity: request.quantity,
          inventoryType: "in",
          disease: request.disease || "",
          organisation: request.organisation._id,
        },
      };

      await createInventoryController(inventoryReq, {
        status: () => ({ send: () => {} }),
      });

      await sendDonationApprovalEmail(
        request.donor.email,
        request.donor.name,
        request.bloodGroup,
        request.quantity,
        request.organisation.organisationName
      );
    }
    if (status === "rejected") {
      await sendDonationRejectionEmail(
        request.donor.email,
        request.donor.name,
        request.bloodGroup,
        request.quantity,
        request.organisation.organisationName
      );
    }

    res.status(200).json({ message: "Request updated", request });
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
// Donor views their donation request history
const getDonorDonationRequests = async (req, res) => {
  try {
    const donorId = req.body.userId;
    const requests = await DonationRequest.find({ donor: donorId }).populate(
      "organisation",
      "organisationName email phoneNumber location"
    );
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Organisation views incoming donation requests
const getOrganisationDonationRequests = async (req, res) => {
  try {
    const orgId = req.body.userId;
    const requests = await DonationRequest.find({
      organisation: orgId,
    }).populate("donor", "name email phoneNumber location");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const deleteDonationRequest = async (req, res) => {
  try {
    const donorId = req.body.userId;
    const { id } = req.params;

    const request = await DonationRequest.findOne({ _id: id, donor: donorId });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot delete a processed request" });
    }

    await DonationRequest.findByIdAndDelete(id);
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const updateDonationRequest = async (req, res) => {
  try {
    const donorId = req.body.userId;
    const { id } = req.params;
    const { quantity, disease, organisationId } = req.body;

    const request = await DonationRequest.findOne({ _id: id, donor: donorId });

    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot edit a processed request" });
    }

    request.quantity = quantity;
    request.disease = disease;
    request.organisation = organisationId;

    await request.save();
    res.status(200).json({ message: "Request updated successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Donor Dashboard Stats
const getDonorStats = async (req, res) => {
  try {
    const donorId = req.body.userId;

    const total = await DonationRequest.countDocuments({ donor: donorId });
    const approved = await DonationRequest.countDocuments({
      donor: donorId,
      status: "approved",
    });
    const rejected = await DonationRequest.countDocuments({
      donor: donorId,
      status: "rejected",
    });

    res.status(200).json({
      total,
      approved,
      rejected,
      donated: approved,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
const getOrg = async (req, res) => {
  const { country, state } = req.body;

  try {
    const filtered = await userModel.find({
      role: "Organisation",
      "location.country": country,
      "location.state": state,
      
    });

    res.status(200).send({ success: true, orgData: filtered });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch organisations" });
  }
};
module.exports = {
  createDonationRequest,
  updateDonationRequestStatus,
  getDonorDonationRequests,
  getOrganisationDonationRequests,
  deleteDonationRequest,
  updateDonationRequest,
  getDonorStats,
  getOrg,
};
