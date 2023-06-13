const mongoose = require("mongoose")



const assignHistorySchema= new mongoose.Schema({
    assignee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        default:null
    },
    assignedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        default:null
    },
    assignedAt:{
        type:Date,
        default:null
    },
})

module.exports= mongoose.model("inquiryassignmenthistory",assignHistorySchema)
