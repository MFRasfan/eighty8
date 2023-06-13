const Role= require("../../model/role")
const Notification = require("../../model/notification")
const user = require("../../model/user")
 
const sendNotification=async({sendAdmin=true, sendManager=true, userId=[],message})=>{
    const notificationData= new Notification({
        message,
    })
    let adminUserIds = [], managerUserIds = [], userIds=[]
   
    //add read status
    userIds= userId.map(item=>({id:item, read:false}))
   
    if(sendAdmin){
        //find admin role id
        const adminRole= await Role.find({role:"admin"})

        //find all users of admin role
        const adminUsers= await user.find({role:adminRole[0]._id})
     
        // add read status 
        adminUserIds = adminUsers.map(item=>({id:item, read:false}))
  
    }
    if(sendManager){
        const managerRole = await Role.find({role:"manager"})
         
        //find all users of manager role
         const managerUsers= await user.find({role: managerRole [0]._id})
       
          // add read status 
       managerUserIds= managerUsers.map(item=>({id:item, read:false}))
    }
    
    // console.log(temp, userId, sendAdmin, sendManager)
     

    // notificationData.roleId=temp
    notificationData.user=[...adminUserIds, ...managerUserIds, ...userIds]
  
    console.log(notificationData)

    await notificationData.save()
}

module.exports={sendNotification}