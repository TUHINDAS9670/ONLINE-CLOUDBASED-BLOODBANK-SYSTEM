const jwt=require("jsonwebtoken")

const authMiddleware=async(req,res,next)=>{
  try {
    const token=req.headers['authorization'].split(" ")[1]
    jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
      if(err){
        return res.status(401).send({
          success:false,
          message:'Auth failed'
        })
      }
      else{
        req.body.userId=decode.userId;
       
        next();
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success:false,
      error,
      messagge:"auth failed"
    })

    
  }

}
module.exports={authMiddleware}