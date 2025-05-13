
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { getHospitalListController, getOrgListController } = require('../controllers/adminController');

// GET all organisation users
router.get("/org-list", async (req, res) => {
  try {
    const organisations = await User.find({ role: "Organisation" }).select("name email");
    res.status(200).json(organisations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch organisations", error });
  }
});
router.get('/hospital-org/list', async (req, res) => {
  try {
    const hospitals = await userModel.find({ role: { $in: ["Hospital", "Organisation"] } });
    res.status(200).send({
      success: true,
      hospitals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Failed to fetch list" });
  }
});


module.exports = router;
