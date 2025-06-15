const userModel = require("../models/userModel");

const getDonorListController=async (req, res) => {
  try {
    const donorData = await userModel
      .find({ role: "Donor" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: donorData.length,
      message: "Donor List Fetched Successfully",
      donorData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Donor List API",
      error,
    });
  }
};
//GET HOSPITAL LIST
const getHospitalListController = async (req, res) => {
  try {
    const hospitalData = await userModel
      .find({ role: "Hospital" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: hospitalData.length,
      message: "HOSPITAL List Fetched Successfully",
      hospitalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital List API",
      error,
    });
  }
};
//GET ORG LIST
const getOrgListController = async (req, res) => {
  try {
    const orgData = await userModel
      .find({ role: "Organisation" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: orgData.length,
      message: "ORG List Fetched Successfully",
      orgData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG List API",
      error,
    });
  }
};
// const getAdminListController = async (req, res) => {
//   try {
//     const AdminData = await userModel
//       .find({ role: "Admin" })
//       .sort({ createdAt: -1 });

//     return res.status(200).send({
//       success: true,
//       Toatlcount: AdminData.length,
//       message: "Admin List Fetched Successfully",
//       AdminData,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error In Admin List API",
//       error,
//     });
//   }
// };
const Admin = require("../models/userModel"); // adjust path if needed

const getAdminListController = async (req, res) => {
  try {
    const currentAdminId = req.body.userId;

    const admins = await Admin.find({ _id: { $ne: currentAdminId },role: "Admin"});

    res.status(200).json({
      success: true,
      admins,
    });
  } catch (error) {
    console.error("Error fetching admin list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin list",
    });
  }
};




// =======================================

//DELETE DONAR
const deleteDonorController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: "Record Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting ",
      error,
    });
  }
};

 

//export
module.exports={getDonorListController,getHospitalListController,getOrgListController,deleteDonorController,getAdminListController}