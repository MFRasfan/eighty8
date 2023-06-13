const mongoose = require("mongoose")


const roleSchema= new mongoose.Schema({
   role:{
        type:String,
        require:true,
        unique:true
    },
   permissions:{
    type:Array,
    default:[]
   },
   status:{
        type:String,
        default:"active"
   }
})

module.exports= mongoose.model("role", roleSchema)