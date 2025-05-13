const InventoryModel = require("../models/InventoryModel");
const mongoose=require ('mongoose')
//GET BLOOD DATA
const bloodGroupDetailsController = async (req, res) => {
  try {
    const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
    const bloodGroupData = [];
    const organisation = new mongoose.Types.ObjectId(req.body.userId);
    //get single blood group
    await Promise.all(bloodGroups.map(async (bloodGroup) => {
      //count total in
      const totalIn = await InventoryModel.aggregate([
        {
          $match: {
            bloodGroup: bloodGroup,
            inventoryType: "in",
            organisation,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$quantity" },
          },
        },
      ]);
    //calculate Total out
      const totalOut = await InventoryModel.aggregate([
        {
          $match: {
            bloodGroup: bloodGroup,
            inventoryType: "out",
            organisation,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$quantity" },
          },
        },
      ]);
      //calculate blood of pericular bloodgroup
const availableBlood=(totalIn[0]?.total || 0) - (totalOut[0]?.total|| 0)

//PUSH Data
bloodGroupData.push({
  bloodGroup,
  totalIn:totalIn[0]?.total || 0,
  totalOut:totalOut[0]?.total||0,
  availableBlood
})
    }))
    return res.status(200).send({
      success:true,
      message:"Blood Group Data Fetch Successfully",
      bloodGroupData

    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Bloodgroup Data Analytics API",
      error,
    });
  }
};
module.exports = {
  bloodGroupDetailsController,
};
