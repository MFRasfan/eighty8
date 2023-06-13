const mongoose = require("mongoose")



const inquirySchema= new mongoose.Schema({
  
    email:{
        type:String
    },

    inquiryNumber:{
        type:String,
        unique:true
    },
    assignHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'inquiryassignmenthistory',
        default:null
    }],

    currentAssignee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        default:null
    },
    firstName:{
        type:String,
           
    },
    lastName:{
        type:String, 
    },
    phone:{
        type:String
    },
    vehicleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'vehicle',
        default:null
    },
  
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        default:null
    },
    status:{
        type:String,
        default:'pending'
    },
    message:{
        type:Array,
        default:[]
    }

}, { timestamps: true })

module.exports= mongoose.model("inquiry",inquirySchema)