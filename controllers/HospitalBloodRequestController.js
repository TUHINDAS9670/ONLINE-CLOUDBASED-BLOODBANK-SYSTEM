const Inventory = require("../models/InventoryModel");
const HospitalRequest = require('../models/HospitalBloodRequest');
const User = require('../models/userModel');
const { createInventoryController } = require("./inventoryController");

// Hospital submits a blood request

const createHospitalRequest = async (req, res) => {
  try {
    const { reason, organisationId, quantity, bloodGroup, userId,hospitalName  } = req.body;

    if (!reason || !organisationId || !quantity || !bloodGroup || !userId || !hospitalName ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = new HospitalRequest({
      reason,
      organisation: organisationId,
      quantity,
      bloodGroup,
      hospital: userId,
      hospitalName 
    });

    await newRequest.save();
    res.status(201).json({ success: true, message: "Request created" });
  } catch (error) {
    console.error("Error in createHospitalRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Organisation updates request status
// const updateHospitalRequestStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!['approved', 'rejected'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     const request = await HospitalRequest.findById(id).populate('hospital organisation');
//     if (!request) return res.status(404).json({ message: 'Request not found' });

//     request.status = status;
//     await request.save();

//     // If approved, remove from inventory
//     if (status === 'approved') {
//       const inventoryReq = {
//         body: {
//           email: request.hospital.email,
//           userId: request.organisation._id.toString(),
//           bloodGroup: request.bloodGroup,
//           quantity: request.quantity,
//           inventoryType: "out",
//           disease: request.disease || "",
//           organisation: request.organisation._id
//         }
//       };

//     const mockRes = {
//   status: function (code) {
//     this.statusCode = code;
//     return this;
//   },
//   send: function (data) {
//     this.data = data;
//   }
// };

// await createInventoryController(inventoryReq, mockRes);

//     }

//     res.status(200).json({ message: 'Request updated', request });
//   } catch (error) {
//     console.error("Approval Error:", error);
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };


const updateHospitalRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const {  remarks } = req.body;


    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await HospitalRequest.findById(id).populate('hospital organisation');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // If trying to approve, first validate inventory
    if (status === "approved") {
      const availableInventory = await Inventory.aggregate([
        {
          $match: {
            organisation: request.organisation._id,
            bloodGroup: request.bloodGroup,
            inventoryType: "in",
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            totalIn: { $sum: "$quantity" },
          },
        },
      ]);

      const usedInventory = await Inventory.aggregate([
        {
          $match: {
            organisation: request.organisation._id,
            bloodGroup: request.bloodGroup,
            inventoryType: "out",
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            totalOut: { $sum: "$quantity" },
          },
        },
      ]);

      const totalIn = availableInventory[0]?.totalIn || 0;
      const totalOut = usedInventory[0]?.totalOut || 0;
      const availableQty = totalIn - totalOut;

      if (availableQty < request.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough blood available. Requested: ${request.quantity}, Available: ${availableQty}`,
        });
      }

      // Add to inventory (type: out)
      const inventoryReq = {
        body: {
          email: request.hospital.email,
          userId: request.organisation._id.toString(),
          bloodGroup: request.bloodGroup,
          quantity: request.quantity,
          inventoryType: "out",
          disease: request.disease || "",
          organisation: request.organisation._id
        }
      };

      const mockRes = {
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        send: function (data) {
          this.data = data;
        }
      };

      await createInventoryController(inventoryReq, mockRes);
    }
request.status = status;
if (status === "rejected" && remarks) {
  request.remarks = remarks;
}
    request.status = status;
    await request.save();

    res.status(200).json({ message: 'Request updated', request });
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Hospital views own requests
const getHospitalRequests = async (req, res) => {
  try {
    const hospitalId = req.body.userId; // pulled from req.body (due to middleware)
    if (!hospitalId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const requests = await HospitalRequest.find({ hospital: hospitalId })
      .populate("organisation", "organisationName email");

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error in getHospitalRequests:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// Organisation views incoming hospital requests
const getOrganisationHospitalRequests = async (req, res) => {
  try {

    const orgId = req.body.userId;
    // const requests = await HospitalRequest.find({ organisation: orgId }).populate('hospital', 'name email');
      const requests = await HospitalRequest.find({ organisation: orgId })
      .populate({
        path: "hospital",
        select: "hospitalName phoneNumber location",
      })
      .populate("organisation", "organisationName");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const deleteHospitalRequest = async (req, res) => {
  try {
    const hospitalId = req.body.userId;
    const { id } = req.params;

    const request = await HospitalRequest.findOne({ _id: id, hospital: hospitalId });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Cannot delete a processed request" });
    }

    await HospitalRequest.findByIdAndDelete(id);
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const updateHospitalRequest = async (req, res) => {
  try {
    const hospitalId = req.body.userId;
    const { id } = req.params;
    const { quantity, disease, organisationId } = req.body;

    const request = await HospitalRequest.findOne({ _id: id, hospital: hospitalId });
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

module.exports = {
  createHospitalRequest,
  updateHospitalRequestStatus,
  getHospitalRequests,
  getOrganisationHospitalRequests,
  deleteHospitalRequest,
  updateHospitalRequest
};
