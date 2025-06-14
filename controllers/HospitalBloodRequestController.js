const Inventory = require("../models/InventoryModel");
const HospitalRequest = require('../models/HospitalBloodRequest');
const User = require('../models/userModel');
const { createInventoryController } = require("./inventoryController");
const { sendHospitalRequestEmail,sendHospitalRequestStatusEmail } = require("../utils/sendMail");



// Hospital submits a blood request




const createHospitalRequest = async (req, res) => {
  try {
    const { reason, organisationId, quantity, bloodGroup, userId, hospitalName } = req.body;

    if (!reason || !organisationId || !quantity || !bloodGroup || !userId || !hospitalName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Fetch organisation details
    const organisation = await User.findById(organisationId);
    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found" });
    }
    const hospitalUser = await User.findById(userId);
    if (hospitalUser.role !== "Hospital") {
      return res.status(404).json({ message: "Hospital user not found" });
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

    await sendHospitalRequestEmail(
     hospitalUser.email,
      hospitalUser.hospitalName,
      organisation.organisationName,
      quantity,
      bloodGroup,
      reason,
      organisation.location.full
    );

    res.status(201).json({ success: true, message: "Request created" });
  } catch (error) {
    console.error("Error in createHospitalRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
};


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
await sendHospitalRequestStatusEmail(
  request.hospital.email,
  request.hospital.hospitalName,
  request.organisation.organisationName || request.organisation.name,
  status,
  request.bloodGroup,
  request.quantity,
  request.reason,
  remarks
);

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
      .populate("organisation", "organisationName email phoneNumber location");

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

// const isoToCountryName = {
//   AF: "Afghanistan",
//   AL: "Albania",
//   DZ: "Algeria",
//   AO: "Angola",
//   AR: "Argentina",
//   AM: "Armenia",
//   AU: "Australia",
//   AT: "Austria",
//   AZ: "Azerbaijan",
//   BD: "Bangladesh",
//   BY: "Belarus",
//   BE: "Belgium",
//   BJ: "Benin",
//   BO: "Bolivia",
//   BA: "Bosnia and Herzegovina",
//   BW: "Botswana",
//   BR: "Brazil",
//   BG: "Bulgaria",
//   KH: "Cambodia",
//   CM: "Cameroon",
//   CA: "Canada",
//   CF: "Central African Republic",
//   TD: "Chad",
//   CL: "Chile",
//   CN: "China",
//   CO: "Colombia",
//   CD: "Congo (DRC)",
//   HR: "Croatia",
//   CU: "Cuba",
//   CY: "Cyprus",
//   CZ: "Czech Republic",
//   DK: "Denmark",
//   EG: "Egypt",
//   EE: "Estonia",
//   ET: "Ethiopia",
//   FI: "Finland",
//   FR: "France",
//   GE: "Georgia",
//   DE: "Germany",
//   GH: "Ghana",
//   GR: "Greece",
//   GT: "Guatemala",
//   HT: "Haiti",
//   HN: "Honduras",
//   HU: "Hungary",
//   IN: "India",
//   ID: "Indonesia",
//   IR: "Iran",
//   IQ: "Iraq",
//   IE: "Ireland",
//   IL: "Israel",
//   IT: "Italy",
//   JM: "Jamaica",
//   JP: "Japan",
//   JO: "Jordan",
//   KZ: "Kazakhstan",
//   KE: "Kenya",
//   KR: "South Korea",
//   KW: "Kuwait",
//   KG: "Kyrgyzstan",
//   LA: "Laos",
//   LV: "Latvia",
//   LB: "Lebanon",
//   LR: "Liberia",
//   LY: "Libya",
//   LT: "Lithuania",
//   LU: "Luxembourg",
//   MG: "Madagascar",
//   MW: "Malawi",
//   MY: "Malaysia",
//   ML: "Mali",
//   MX: "Mexico",
//   MD: "Moldova",
//   MN: "Mongolia",
//   ME: "Montenegro",
//   MA: "Morocco",
//   MZ: "Mozambique",
//   MM: "Myanmar",
//   NP: "Nepal",
//   NL: "Netherlands",
//   NZ: "New Zealand",
//   NI: "Nicaragua",
//   NE: "Niger",
//   NG: "Nigeria",
//   KP: "North Korea",
//   NO: "Norway",
//   OM: "Oman",
//   PK: "Pakistan",
//   PS: "Palestine",
//   PA: "Panama",
//   PY: "Paraguay",
//   PE: "Peru",
//   PH: "Philippines",
//   PL: "Poland",
//   PT: "Portugal",
//   QA: "Qatar",
//   RO: "Romania",
//   RU: "Russia",
//   RW: "Rwanda",
//   SA: "Saudi Arabia",
//   RS: "Serbia",
//   SG: "Singapore",
//   SK: "Slovakia",
//   SI: "Slovenia",
//   SO: "Somalia",
//   ZA: "South Africa",
//   ES: "Spain",
//   LK: "Sri Lanka",
//   SD: "Sudan",
//   SE: "Sweden",
//   CH: "Switzerland",
//   SY: "Syria",
//   TW: "Taiwan",
//   TJ: "Tajikistan",
//   TZ: "Tanzania",
//   TH: "Thailand",
//   TR: "Turkey",
//   UG: "Uganda",
//   UA: "Ukraine",
//   AE: "United Arab Emirates",
//   GB: "United Kingdom",
//   US: "United States",
//   UY: "Uruguay",
//   UZ: "Uzbekistan",
//   VE: "Venezuela",
//   VN: "Vietnam",
//   YE: "Yemen",
//   ZM: "Zambia",
//   ZW: "Zimbabwe"
// };



const getOrg = async (req, res) => {
  let { country, stateVariants, city } = req.body;

  try {
    const andConditions = [{ role: "Organisation" }];

    if (country) {
      andConditions.push({
        "location.country": new RegExp(`^${country}$`, "i"),
      });
    }

    if (Array.isArray(stateVariants) && stateVariants.length > 0) {
      andConditions.push({
        $or: stateVariants.map((s) => ({
          "location.state": new RegExp(`^${s}$`, "i"),
        })),
      });
    }

    if (city) {
      andConditions.push({
        "location.city": new RegExp(`^${city}$`, "i"),
      });
    }

    const filtered = await User.find({ $and: andConditions });
    res.status(200).send({ success: true, orgData: filtered });
  } catch (err) {
    console.error("Error in getOrg:", err);
    res.status(500).send({ success: false, message: "Failed to fetch organisations" });
  }
};








module.exports = {
  createHospitalRequest,
  updateHospitalRequestStatus,
  getHospitalRequests,
  getOrganisationHospitalRequests,
  deleteHospitalRequest,
  updateHospitalRequest,getOrg
};
