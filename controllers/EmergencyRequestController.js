// controllers/emergencyRequestController.js
import EmergencyRequest from "../models/EmergencyRequestModel";

// ➤ Create Emergency Request
export const createEmergencyRequestController = async (req, res) => {
  try {
    const { name, email, phone, bloodGroup, quantity, location, organisationId } = req.body;

    if (!name || !email || !phone || !bloodGroup || !quantity || !location) {
      return res.status(400).send({ success: false, message: "All required fields must be filled" });
    }

    const newRequest = new EmergencyRequest({
      name,
      email,
      phone,
      bloodGroup,
      quantity,
      location,
      organisationId: organisationId || null,
    });

    await newRequest.save();

    res.status(201).send({
      success: true,
      message: "Emergency blood request submitted successfully.",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error in createEmergencyRequestController:", error);
    res.status(500).send({ success: false, message: "Something went wrong", error });
  }
};

// ➤ Get All Requests (For Admin / Org)
export const getAllEmergencyRequestsController = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find().sort({ createdAt: -1 });
    res.status(200).send({ success: true, requests });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching emergency requests", error });
  }
};

// ➤ Get Requests by Email (Patient view)
export const getMyEmergencyRequestsController = async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await EmergencyRequest.find({ email }).sort({ createdAt: -1 });

    res.status(200).send({ success: true, requests });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching user requests", error });
  }
};

// ➤ Update Request Status (Accept / Reject)
export const updateEmergencyRequestStatusController = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).send({ success: false, message: "Invalid status value" });
    }
    

    const request = await EmergencyRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: `Request ${status.toLowerCase()} successfully`,
      request,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error updating request status", error });
  }
};
