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
    //reset data
    // const user=new userModel(req.body)
   
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
       // Compose name
      //  const fullName =
      //  role === "Donor" || role === "Admin" || role === "User"
      //    ? `${firstName} ${lastName}`.trim()
      //    : undefined;
        // Create user
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
    
    
// const userData = {
//   name,
//   email,
//   password: hashPassword,
//   phoneNumber,
//   role,
//   location
// };

// if (role === "Organisation") {
//   userData.organisationName = req.body.organisationName;
// }
// if (role === "Hospital") {
//   userData.hospitalName = req.body.hospitalName;
// }

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


module.exports={registerController,loginController,currentUserController};
