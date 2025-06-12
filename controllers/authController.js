const userModel = require("../models/userModel");
const bcrypt =require('bcryptjs')
const jwt=require('jsonwebtoken')
const registerController=async(req,res)=>{
  try {
    const existingUser=await userModel.findOne({email:req.body.email})
    //validation
    if(existingUser){
      return res.status(200).send({
        success:false,
        message:'User Already exists'
      })
    }
    //hash password
    const salt=await bcrypt.genSalt(10)
    const hashPassword=await bcrypt.hash(req.body.password,salt);
    req.body.password=hashPassword

    const {
      name,
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      organisationName,
      hospitalName,
      bloodGroup,
      location,
    } = req.body;

        const user = new userModel({
          name: name?.trim() ||'',

          firstName,
          lastName,
          email:email,
          password: hashPassword,
          phoneNumber:phoneNumber,
          role:role,
          organisationName: organisationName || '',
          hospitalName: hospitalName || '',
          bloodGroup: bloodGroup || '',
          // location: {
          //   country: address?.country || '',
          //   state: address?.state || '',
          //   district: address?.district || '',
          //   city: address?.city || '',
          //   location: address?.location || '',
          //   full: address?.full || '',
          // },
          location:location || ''
        });
    
    


// const user = new userModel(userData);
    await user.save()
    return res.status(201).send({
      success:true,
      message:'User Registered Successfuly',
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error in Register API",
      error:error.message||error
    })
  }
  console.log("Request Body:", req.body);
};

//login call back
const loginController=async(req,res)=>{
try {
  const user=await userModel.findOne({email:req.body.email})
  if(!user){
    return res.status(404).send({
      success:false,
      message:"User not found"
    })
  }
  //check role
  if(user.role !== req.body.role){
    return res.status(500).send({
      success:false,
      message:"Role doesn't match"
    })
  }
  //compare password
  const comparePassword=await bcrypt.compare(req.body.password,user.password)
  if(!comparePassword){
    return res.status(500).send({
      success:false,
      message:"Invalid Credentials"
    })
  }
  const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})//encryption of token
  return res.status(200).send({
    success:true,
    message:"Login Successfully",
    token,
    user:user

  })
} catch (error) {
  console.log(error);
  res.status(500).send({
    success:false,
    message:"Error in Login API",
    error


  })
  
}
}
//get current user
const  currentUserController=async(req,res)=>{
  try {
    const user=await userModel.findOne({_id:req.body.userId})
    return res.status(200).send({
      success:true,
      message:"User fetched successfully",
      user,
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success:false,
      message:"unable to fetch current user",
      error,
    });
  }
};
// update user profile
const updateProfileController = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Destructure and sanitize updatable fields
    const {
      name,
      firstName,
      lastName,
      email,
      phoneNumber,
      organisationName,
      hospitalName,
      bloodGroup,
      location,
    } = req.body;

    user.name = name || user.name;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.organisationName = organisationName || user.organisationName;
    user.hospitalName = hospitalName || user.hospitalName;
    user.bloodGroup = bloodGroup || user.bloodGroup;
    user.location = location || user.location;

    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating profile",
      error,
    });
  }
};

// UPDATE USER PROFILE
const updateUserProfileController = async (req, res) => {
  try {
    const { userId } = req.body;

    const updatedData = { ...req.body };
    delete updatedData.userId; // avoid accidentally updating userId
    delete updatedData.password; // password change should be separate

    const user = await userModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
const changePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Old password and new password are required",
      });
    }

    const { userId } = req.body; // ✅ From auth middleware
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password Change Error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};


module.exports={registerController,loginController,currentUserController,updateProfileController,updateUserProfileController,changePasswordController};
