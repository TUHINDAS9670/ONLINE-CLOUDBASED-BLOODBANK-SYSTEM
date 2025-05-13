// controllers/hospitalOrgController.js
const User = require("../models/userModel");

const getAllHospitalOrg = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['hospital', 'organisation'] } }).select("-password");
    res.status(200).send({
      success: true,
      hospitals: users,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching hospitals", error });
  }
};

module.exports = { getAllHospitalOrg };
