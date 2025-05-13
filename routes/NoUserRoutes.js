// routes/hospitalOrgRoutes.js
const express = require("express");
const router = express.Router();
const { getAllHospitalOrg } = require("../controllers/NoUserController");
const userModel = require("../models/userModel");


// Combined hospitals + organisations list
router.get("/list", async (req, res) => {
  try {
    const hospitals = await userModel.find({ role: "Hospital" }).sort({ createdAt: -1 });
    const organisations = await userModel.find({ role: "Organisation" }).sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      hospitals: [...hospitals, ...organisations],
    });
  } catch (error) {
    console.error("Error in /hospital-org/list route:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch hospitals and organisations",
      error,
    });
  }
});
router.get("/list", getAllHospitalOrg);

module.exports = router;
