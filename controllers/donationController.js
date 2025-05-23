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

const DonationRequest = require('../models/DonationRequestModel');
const User = require('../models/userModel');
const { createInventoryController } = require("./inventoryController");

// Donor submits donation request
const createDonationRequest = async (req, res) => {
  try {
    const donorId = req.body.userId;
    const { organisationId, bloodGroup, quantity, disease } = req.body;

    const organisation = await User.findById(organisationId);
    if (!organisation || organisation.role !== 'Organisation') {
      return res.status(400).json({ message: 'Invalid organisation' });
    }

    const request = await DonationRequest.create({
      donor: donorId,
      organisation: organisationId,
      bloodGroup,
      quantity,
      disease
    });

    res.status(201).json({ message: 'Donation request submitted', request });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Organisation updates request status
const updateDonationRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await DonationRequest.findById(id).populate('donor organisation');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    await request.save();

    // If approved, use centralized inventory creation
    if (status === 'approved') {
      const inventoryReq = {
        body: {
          email: request.donor.email,
          userId: request.organisation._id.toString(),
          bloodGroup: request.bloodGroup,
          quantity: request.quantity,
          inventoryType: "in",
          disease: request.disease || "",
          organisation: request.organisation._id
        }
      };

      // Use a dummy res object to suppress internal responses
      await createInventoryController(inventoryReq, {
        status: () => ({ send: () => {} })
      });
    }

    res.status(200).json({ message: 'Request updated', request });
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Donor views their donation request history
const getDonorDonationRequests = async (req, res) => {
  try {
    const donorId = req.body.userId;
    const requests = await DonationRequest.find({ donor: donorId }).populate('organisation', 'organisationName email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Organisation views incoming donation requests
const getOrganisationDonationRequests = async (req, res) => {
  try {
    const orgId = req.body.userId;
    const requests = await DonationRequest.find({ organisation: orgId }).populate('donor', 'name email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
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
      return res.status(400).json({ message: "Cannot delete a processed request" });
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
      return res.status(400).json({ message: "Cannot edit a processed request" });
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
    const approved = await DonationRequest.countDocuments({ donor: donorId, status: 'approved' });
    const rejected = await DonationRequest.countDocuments({ donor: donorId, status: 'rejected' });

    res.status(200).json({
      total,
      approved,
      rejected,
      donated: approved
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
  createDonationRequest,
  updateDonationRequestStatus,
  getDonorDonationRequests,
  getOrganisationDonationRequests,
  deleteDonationRequest,
  updateDonationRequest,
  getDonorStats
};

