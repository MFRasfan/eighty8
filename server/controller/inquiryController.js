const { STATUS_CODES } = require("http");
const { default: mongoose } = require("mongoose");
const assignedHistory = require("../model/assignedHistory");
const inquires = require("../model/inquires");
const User = require("../model/user");
const { addInquirySchema, guestInquirySchema } = require("../shared/validationSchema/inquirySchema");
const {sendEmail} = require("../shared/sendgrid");
const { sendNotification } = require("../shared/notification");


const createInquiryDetails= async(req,res)=>{
    try {
        const {customerId}=req.body
        let validData;
        if(customerId){
            validData = addInquirySchema.validate(req.body)
        }else{
            validData = guestInquirySchema.validate(req.body)
        }
        const  {value,error}= validData;
        if(error){
          return  res.status(400).json({error:error.details[0].message})
        }

        const user= await User.findById(customerId).select('email')
        const data={
            ...value,
             message:[
                {
                    type:"customer",
                    customerId:customerId|| null,
                    message:value.message,
                    sentAt: new Date()
                }
            ]}
        const newRecord= new inquires(data);
        console.log(newRecord, data)
        await newRecord.save()

        if(newRecord._id){

          const msg = {
            email: user&& user.email? user.email: value.email,
            from: process.env.SENDGRID_EMAIL,
            subject: "Vehicle Inquiry",
            text: `thank you for visiting Eighty Eight Alpha Autos, your inquiry has been submitting succesfully. Our team member will contact you shortly. thank you`,
            html: `
            <div>
              <p>thank you for visiting Eighty Eight Alpha Autos, your inquiry has been submitting succesfully. Our team member will contact you shortly. thank you</p>
              </br>
            </div>
            `,
          };
      
            await sendEmail(msg)
            
          

            const message = user&& user.firstName? `A new inquiry has placed by ${user.firstName} ${user.lastName}`: `An inquiry has placed by a guest customer`
        
            sendNotification({
              sendAdmin:true,
              sendManager:true,
              userId: customerId? [customerId]:[],
              message     
            })


            res.status(201).json({message:"Your inquiry has submitted successfully"})
        }

    } catch (error) {
        console.log(error.message)
        res.json({error:"Something went wrong"})
    }
  
}


const getInquiryDetails = (req, res) => {
  try {
    inquires
      .findById(req.query.id)
      .populate("vehicleId")
      .populate({
        path: "assignHistory",
        model: 'inquiryassignmenthistory',
        populate: {
          path: "assignee assignedBy",
          model: "user",
          select: "firstName lastName",
        },
      })
      .exec((err, doc) => {
        if (err) {
          res.json({
            error: "Database Error",
            reason: err.messsage,
          });
        } else if (doc) {
          res.json({ data: doc });
        } else {
          res.json({ data: [] });
        }
      });
  } catch (error) {
    res.json({ error: "Something went wrong" });
  }
};

const updateInquiryDetails= async (req,res)=>{
   try {
    //inquiryid, 
    //if message then who is sending message customer or staff?
    // if assignment then update assignment history
    // if status then update status
    //send email to customer on create inquiry , complete or close inquiry, or receive any message from staff
    const {id}= req.query
    
    if(!id){
        return res.json({error:"Id not found"})
    }
    const record= await inquires.findById(id)
 
    const {message ,type, assignee, assignedBy, assignedAt, status}=req.body
    let customerDetails={}
    if(record.customerId){
       customerDetails = await User.findById(record.customerId).select('email firstName lastName')
    }
    if(message){
            let temp= Object.assign({},record._doc)

            console.log("================",temp)
            temp.message.push({
                    type:  type || 'customer',
                    message: message,
                    sentAt: new Date()
            })

      

            inquires.findByIdAndUpdate(id, temp,{new:true})
            .exec((err, doc)=>{
              console.log("message update", err, doc)
                if(err){
                    res.json({error:'database error'})
                }
                if(doc){
                  
                    let id=[]
                    message.customerId && id.push(message.customerId)
                    if(message.customerId && message.type ==="staff"){
                      id.push(message.customerId) 
                    }
                    
                    if(message.type==="customer" && doc.currentAssignee !== null){
                      id.push(currentAssignee) 
                    }
                    if(message)
                    sendNotification({
                      sendAdmin:true,
                      sendManager:true,
                      userId: id,
                      message: `A new message has received from ${type==="staff"? "sales agent":"customer"}`
                    })
        

                    res.json({
                        data:doc
                    })
                }else{
                    res.json({error:"Something went wrong"})
                }
            })
        }

    else if(assignee && assignedBy && assignedAt){
        let data ={
             assignee,
             assignedAt,
             assignedBy
        }

        const InquiryDetails= await inquires.findById({_id:id})
        const newRecord= new assignedHistory(data)
        newRecord.save()


        if(newRecord._id){
        const salesEmail = await User.findById(assignee).select('email')
        const assignedByData = await User.findById({_id: mongoose.Types.ObjectId(assignedBy)}).select('email')

        // let customerDetails={}
        // if(InquiryDetails.customerId){
        //    customerDetails = await User.findById(InquiryDetails.customerId).select('email firstName lastName')
        // }
        const assignedByDetails = await User.findById(assignedBy)
        const assigneeDetails = await User.findById(assignee)

      // console.log({salesEmail, customerDetails, assignedByDetails,assignedByData, assignedBy,assignee})

          const msg = {
            email: salesEmail,
            from: process.env.SENDGRID_EMAIL,
            subject: "Vehicle Inquiry",
            text: `You got assigned an inquiry of our valued customer
            ${customerDetails.firstName|| InquiryDetails.firstName} 
            ${customerDetails.lastName|| InquiryDetails.lastName}
             has assigned to ${assigneeDetails.firstName} ${assigneeDetails.lastName} 
             by our manager ${assignedByDetails.firstName} ${assignedByDetails.lastName}`,
            html: `
            <div>
              <p>You got assigned an inquiry of our valued customer
               ${customerDetails.firstName|| InquiryDetails.firstName} 
               ${customerDetails.lastName|| InquiryDetails.lastName}
                has assigned to ${assigneeDetails.firstName} ${assigneeDetails.lastName} 
                by our manager ${assignedByDetails.firstName} ${assignedByDetails.lastName}</p>
              </br>
            </div>
            `,
          };
      
            await sendEmail(msg)   
            inquires.findByIdAndUpdate(
                { _id: id },
                { $push: { assignHistory: newRecord} , currentAssignee:assignee},
                { new: true },
                (err, doc) => {
                    if (err) {

                        res.json({error:"database error"})
                      console.error(err);
                    } else {
                      let id=[]
                      
                      
                      if(doc.currentAssignee !== null){
                        id.push(doc.currentAssignee) 
                      }
                     
                      sendNotification({
                        sendAdmin:true,
                        sendManager:true,
                        userId: id,
                        message: `An inquiry of our valued customer ${customerDetails.firstName|| InquiryDetails.firstName} ${customerDetails.lastName|| InquiryDetails.lastName} has assigned to ${assigneeDetails.firstName} ${assigneeDetails.lastName}  by our manager ${assignedByDetails.firstName} ${assignedByDetails.lastName}`
                      })
          
                      console.log("assignee updatd--------------",doc);
                        res.json({message:`The inquiry has updated successfully`, doc})
                    }
                  })
        }
    }else if (status){
      
      inquires.findByIdAndUpdate(
        { _id: id },
        {status:status},
        { new: true },
        async(err, doc) => {
          if (err) {
            
            res.json({error:"database error"})
            console.error(err);
          } else {
         
            if(status==="completed" || status==="cancelled" || status==="closed"){
              
             // const customerDetails = await User.findById(doc.customerId).select('email firstName lastName')
                  const msg = {
                    email: customerDetails.email|| doc.email,
                    from: process.env.SENDGRID_EMAIL,
                    subject: "Vehicle Inquiry Status Update",
                    text: `Your inquiry has been ${status}, for further details please contact admin thank you`,
                    html: `
                    <div>
                      <p>Dear ${customerDetails.firstName || doc.firstName} ${customerDetails.lastName||doc.lastName},</p>
                      <p>Your inquiry has been ${status}, for further details please contact admin thank you</p>
                      </br>
                    </div>
                    `,
                  };
                await sendEmail(msg) 

                
                
              }
              let id=[]
              if(doc.currentAssignee !== null){
                id.push(doc.currentAssignee) 
              }
             
              if(doc.customerId !== null){
                id.push(doc.currentAssignee) 
              }
             
              if(doc.customerId !== null){
                id.push(doc.customerId)
              }
              sendNotification({
                sendAdmin:true,
                sendManager:true,
                userId: id,
                message: `An inquiry status of  customer ${customerDetails.firstName|| doc.firstName}${customerDetails.lastName|| doc.lastName}  has updated to ${status}`
              })

              res.json({message:`The inquiry has updated successfully`})
                  console.log(doc);
                }
              })
    }



   } catch (error) {
        console.log(error)
        res.json({error:"Something went wrong"})
   }
}

const getAllInquiries= async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;
        const sort = { createdAt: -1 }; // latest records on top
        let searchQuery={}
        if(req.query.customerId){
          searchQuery.customerId=req.query.customerId
        }
        if(req.query.salesId){
          searchQuery={
            ...searchQuery,
            'currentAssignee': req.query.salesId,
          }
        }
        const count = await inquires.countDocuments();
        const data = await inquires.find(searchQuery)
        .populate('vehicleId')
        .populate({
          path: "assignHistory",
          model: 'inquiryassignmenthistory',
          populate: {
            path: "assignee assignedBy",
            model: "user",
            select: "firstName lastName",
          },
        })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      ;

    res.json({
      data,
      page,
      pages: Math.ceil(count / limit),
      limit,
      total: count,
    });
        
    } catch (error) {
     console.log(error)
     res.json({
        error:"Something went wrong"
     })   
    }
}

const getInquirySalesReport = async (req, res) => {
  // try {
  //   const { from, to, assignee } = req.query;
    
  //   let inquiryQuery = {};
  //   if (from && to) {
  //     inquiryQuery.createdAt = {
  //       $gte: new Date(from),
  //       $lte: new Date(to),
  //     };
  //   }

  //   const inquiries = await inquires.find(inquiryQuery).populate({
  //     path: "assignHistory",
  //     match: { assignee: assignee ? assignee : { $exists: true } },
  //   });

  //   const totalInquiries = inquiries.length;

  //   const activeInquiries = inquiries.filter((inquiry) => inquiry.status === "active").length;
  //   const pendingInquiries = inquiries.filter((inquiry) => inquiry.status === "pending").length;
  //   const cancelledInquiries = inquiries.filter((inquiry) => inquiry.status === "cancelled").length;
  //   const completedInquiries = inquiries.filter((inquiry) => inquiry.status === "completed").length;
  //   const closedInquiries = inquiries.filter((inquiry) => inquiry.status === "closed").length;

  //   let assigneeStatistics = {};
  //   if (assignee) {
  //     assigneeStatistics = inquiries.reduce((acc, inquiry) => {
  //       const history = inquiry.assignHistory.find((h) => h.assignee.toString() === assignee.toString());
  //       if (history) {
  //         const key = new Date(history.assignedAt).toISOString().slice(0, 7);
  //         if (!acc[key]) {
  //           acc[key] = {
  //             total: 0,
  //             active: 0,
  //             pending: 0,
  //             cancelled: 0,
  //             completed: 0,
  //             closed: 0,
  //           };
  //         }
  //         acc[key].total++;
  //         acc[key][inquiry.status]++;
  //       }
  //       return acc;
  //     }, {});
  //   }

  //   return res.status(200).json({
  //     totalInquiries,
  //     activeInquiries,
  //     pendingInquiries,
  //     cancelledInquiries,
  //     completedInquiries,
  //     closedInquiries,
  //     assigneeStatistics,
  //   });
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json({ message: "Internal server error" });
  // }

  const { from, to, assignee } = req.query;

try {
  let inquiryQuery = {};
  if (from && to) {
    inquiryQuery.createdAt = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  } else {
    // Set the default from date to 1 year ago, same month
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);
    inquiryQuery.createdAt = {
      $gte: oneYearAgo,
      $lte: today,
    };
  }
  

  const inquiries = await inquires.find(inquiryQuery).populate({
    path: "assignHistory",
    match: { assignee: assignee ? assignee : { $exists: true } },
  });

  const totalInquiries = inquiries.length;
  const activeInquiries = inquiries.filter((inquiry) => inquiry.status === "active").length;
  const pendingInquiries = inquiries.filter((inquiry) => inquiry.status === "pending").length;
  const cancelledInquiries = inquiries.filter((inquiry) => inquiry.status === "cancelled").length;
  const completedInquiries = inquiries.filter((inquiry) => inquiry.status === "completed").length;
  const closedInquiries = inquiries.filter((inquiry) => inquiry.status === "closed").length;

  let statistics = {};
  const startDate = new Date(from);
  const endDate = new Date(to);
  const currDate = new Date(startDate);

  while (currDate <= endDate) {
    const key = currDate.toISOString().slice(0, 7);
    statistics[key] = {
      total: 0,
      active: 0,
      pending: 0,
      cancelled: 0,
      completed: 0,
      closed: 0,
    };
    currDate.setMonth(currDate.getMonth() + 1);
  }

  inquiries.forEach((inquiry) => {
    const history = assignee ? inquiry.assignHistory.find((h) => h.assignee.toString() === assignee.toString()) : null;
    const inquiryDate = new Date(inquiry.createdAt).toISOString().slice(0, 7);
    const historyDate = history ? new Date(history.assignedAt).toISOString().slice(0, 7) : null;
    
    if (history && historyDate in statistics) {
      statistics[historyDate].total++;
      statistics[historyDate][inquiry.status]++;
    } else if (!assignee && inquiryDate in statistics) {
      statistics[inquiryDate].total++;
      statistics[inquiryDate][inquiry.status]++;
    }
  });

  return res.status(200).json({
    totalInquiries,
    activeInquiries,
    pendingInquiries,
    cancelledInquiries,
    completedInquiries,
    closedInquiries,
    statistics,
  });
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}


};




module.exports={
    createInquiryDetails,
    getAllInquiries,
    updateInquiryDetails,
    getInquiryDetails,
    getInquirySalesReport
}