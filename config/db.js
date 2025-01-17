const mongoose =require('mongoose')
const colors=require('colors')

const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.DATABASE)
    console.log(`connected to mongodb server ${mongoose.Collection.host}`.bgBlue.white)
  }
  catch(error){
    console.log(`mongodb server error ${error}`.bgRed.white);
    
  }
}
module.exports=connectDB;