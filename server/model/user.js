const mongoose = require("mongoose")

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    firstName:{
        type:String,
        default:""
    },
    lastName:{
        type:String,
        default:""
      
    },
    phone:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:""
    },
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"role"
    },
    status:{
        type:String,
        default:"active"
   },
   isEmailVerified:{
    type:Boolean,
    default:false
   },
   emailToken: {
    code: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
},{timestamps:true})

module.exports= mongoose.model("user",userSchema)