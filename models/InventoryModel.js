const mongoose =require ('mongoose')
const InventoryModel=new mongoose.Schema({

  
inventoryType:{
type:String,
required:[true,'inventory type required'],
enum:['in','out']
},
bloodGroup:{
  type:String,
required:[true,'blood group is required'],
enum:['O+','O-','AB+','AB-','A+','A-','B+','B-']
},
quantity:{
  type:Number,
  required:[true,'blood quantity is required']
},

email:{
type:String,
required:[true,"Donor Email is Required"]
},

organisation:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'users',
  required:[true,'organisation is required']
},
hospital:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'users',
  required:function(){
    return this.inventoryType=='out'
  }
},
requesterType: {
  type: String,
  enum: ["Hospital", "Patient"],
  required: function () {
    return this.inventoryType === "out";
  }
},


donor:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'users',
  required:function(){
    return this.inventoryType=='in'
  }
},
},{timestamps:true})
module.exports=mongoose.model('inventory',InventoryModel)