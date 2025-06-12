const mongoose = require("mongoose");

const inventoryModel = require("../models/InventoryModel")
const userModel = require("../models/userModel");
// const InventoryModel = require("../models/InventoryModel");

//create invetory
const createInventoryController=async(req,res)=>{
    try {
      const{email}=req.body
      //validation
      const user=await userModel.findOne({email})
      if(!user){
        throw new Error ('User Not Found')
      }
      // if(inventoryType==="in" && user.role !=='donor'){
      //   throw new Error ('Not a donor account')
      // }
      // if(inventoryType ==="out" && user.role !== 'hospital')
      // {
      //   throw new ErrorEvent('Not a hospital')
      // }
      if(req.body.inventoryType=='out'){
        const requestedBloodGroup=req.body.bloodGroup;
        const requestedQuantityOfBloodGroup=req.body.quantity;
        const organisation = new mongoose.Types.ObjectId(req.body.userId)
        //calculate Blood Quantity
        const totalInOfRequestedBloodGroup=await inventoryModel.aggregate([
          {$match:{
            organisation,
            inventoryType:'in',
            bloodGroup:requestedBloodGroup
          }},{
            $group:{
              _id:'$bloodGroup',
              total:{$sum:'$quantity'}
            },
          },
        ]);
        console.log("Total In",totalInOfRequestedBloodGroup);
        const totalIn=totalInOfRequestedBloodGroup[0]?.total || 0;
        //calculate OUT blood Quantity
        const totalOutOfRequestedBloodGroup=await inventoryModel.aggregate([
          {$match:{
            organisation,
            inventoryType:'out',
            bloodGroup:requestedBloodGroup
          }},
          {
            $group:{
              _id:'$bloodGroup',
              total:{$sum:'$quantity'}
            }
          }
        ])
        const totalOut=totalOutOfRequestedBloodGroup[0]?.total || 0;
        //in & out calc
        const availableQuantityOfBloodGroup=totalIn-totalOut; 
        
        //quality validation
        if(availableQuantityOfBloodGroup<requestedQuantityOfBloodGroup){
          return res.status(500).send({
            success:false,
            message:`only ${availableQuantityOfBloodGroup} ML of ${requestedQuantityOfBloodGroup.toUpperCase()} is available`
          })
        }
        req.body.hospital=user?._id;
      }
      else{
        req.body.donor=user?._id;
      }
      // if all validation checks successfully  then save record
      const inventory=new inventoryModel(req.body)
      await inventory.save()
      return res.status(201).send({
        success:true,
        message:'New Blood Record Added'
      })
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success:false,
        message:'Error In Create Inventory API',
        error:error
      })
      
    }
}
//get all blood records

const getInventoryController=async(req,res)=>{
  try {
    const inventory=await inventoryModel.find({organisation:req.body.userId}).populate("donor").populate("hospital").sort({createdAt:-1})
    //.populate method to show donor and hospital details with this request which donor do the request etc...
    return res.status(200).send({
      success:true,
      message:"get all records successfully",
      inventory,
    })
  } catch (error) {
    console.log(error);
    
    return res.status(500).send({
      success:false,
      message:"unable to get inventory data",
      error,
    })
  }
};
//get Hospital blood records
// const getInventoryHospitalController=async(req,res)=>{
//   try {
//     const inventory=await inventoryModel.find(req.body.filters).populate("donor").populate("hospital").populate("organisation").sort({createdAt:-1})
//     //.populate method to show donor and hospital details with this request which donor do the request etc...
//     return res.status(200).send({
//       success:true,
//       message:"get hospital consumer  records successfully",
//       inventory,
//     })
//   } catch (error) {
//     console.log(error);
    
//     return res.status(500).send({
//       success:false,
//       message:"unable to get hospital consumer data",
//       error,
//     })
//   }
// };


const getInventoryHospitalController = async (req, res) => {
  try {
    const { inventoryType, donor } = req.body.filters || {};

    const query = {};

    if (inventoryType) {
      query.inventoryType = inventoryType;
    }

    if (donor) {
      query.donor = new mongoose.Types.ObjectId(donor); // 👈 Correct filtering
    }

    const inventory = await inventoryModel
      .find(query)
      .populate("donor")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Get hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log("Inventory Fetch Error:", error);
    return res.status(500).send({
      success: false,
      message: "Unable to get hospital consumer data",
      error,
    });
  }
};
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .limit(5)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "recent Invenotry Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Recent Inventory API",
      error,
    });
  }
};



// get donor records
const getDonorsController=async(req,res)=>{
  try {
    const organisation=req.body.userId
    //find donors
    const donorId=await inventoryModel.distinct("donor",{
      organisation
    });
    console.log(donorId);
    const donors=await userModel.find({_id:{$in:donorId}});
    return res.status(200).send({
      success:true,
      message:"Donor Record Fetched Successfully",
      donors
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success:false,
      messsage:'Error in Donor records',
      error
    })
    
  }
};
const getHospitalsController=async(req,res)=>{
try{
const organisation=req.body.userId;
//get hospitalid
const hospitalId=await inventoryModel.distinct('hospital',{organisation})
//find hospital
const hospitals=await userModel.find({
  _id:{$in:hospitalId}
})
return res.status(200).send({
  success:true,
  message:'Hospitals Data Fetched ',
  hospitals
})
}
catch(error){
  console.log(error)
  return res.status(500).send({
    success:false,
    message:'Error in get Hospital API',error
  })
}
}
const getOrganisationsController=async(req,res)=>{
try {
  const donor=req.body.userId
  const orgId=await inventoryModel.distinct('organisation',{donor})
  //find org
   const org=await userModel.find({
    _id:{$in:orgId}
   })
   return res.status(200).send({
    success:true,
    message:'Org Data Fetched Successfully',
    org
   })
} catch (error) {
  console.log(error);
  return res.status(500).send({
    success:false,
    message:"Error In ORG API",
    error


  })
  
}
}
const getOrganisationsForHospitalsController=async(req,res)=>{
try {
  const hospital=req.body.userId
  const orgId=await inventoryModel.distinct('organisation',{hospital})
  //find org
   const org=await userModel.find({
    _id:{$in:orgId}
   })
   return res.status(200).send({
    success:true,
    message:'Hospital-Org Data Fetched Successfully',
    org
   })
} catch (error) {
  console.log(error);
  return res.status(500).send({
    success:false,
    message:"Error In Hospital-ORG API",
    error


  })
  
}
}

const getPublicInventory = async (req, res) => {
  try {
    const { bloodGroup, state, city } = req.body;

    let matchQuery = { inventoryType: "in" };
    if (bloodGroup) matchQuery.bloodGroup = bloodGroup;

    const inventoryIn = await inventoryModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            bloodGroup: "$bloodGroup",
            organisation: "$organisation"
          },
          totalIn: { $sum: "$quantity" }
        }
      }
    ]);

    const inventoryOut = await inventoryModel.aggregate([
      {
        $match: {
          inventoryType: "out",
          ...(bloodGroup && { bloodGroup }),
        }
      },
      {
        $group: {
          _id: {
            bloodGroup: "$bloodGroup",
            organisation: "$organisation"
          },
          totalOut: { $sum: "$quantity" }
        }
      }
    ]);

    const inventoryMap = {};

    // Add 'in' quantities
    inventoryIn.forEach(i => {
      const key = `${i._id.organisation}_${i._id.bloodGroup}`;
      inventoryMap[key] = {
        organisation: i._id.organisation,
        bloodGroup: i._id.bloodGroup,
        total: i.totalIn
      };
    });

    // Subtract 'out' quantities
    inventoryOut.forEach(o => {
      const key = `${o._id.organisation}_${o._id.bloodGroup}`;
      if (inventoryMap[key]) {
        inventoryMap[key].total -= o.totalOut;
        if (inventoryMap[key].total < 0) inventoryMap[key].total = 0;
      }
    });

    // Build final result
    const result = [];
    for (const key in inventoryMap) {
      const { organisation, bloodGroup, total } = inventoryMap[key];
      const user = await userModel.findById(organisation);

      if (!user || user.role !== "Organisation") continue;
      if (state && user?.location?.state !== state) continue;
      if (city && user?.location?.city !== city) continue;

      result.push({
        bloodGroup,
        available: total,
        bloodBankName: user.organisationName,
        address: user.location?.location || "N/A",
        state: user.location?.state || "N/A",
        city: user.location?.city || "N/A",
        contact: user.phoneNumber || "N/A",
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in public inventory:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};



module.exports={
  createInventoryController,getInventoryController,
  getDonorsController,
  getHospitalsController,
  getOrganisationsController,getPublicInventory,
  getOrganisationsForHospitalsController,getInventoryHospitalController,getRecentInventoryController,

}