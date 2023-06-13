const User = require("../model/user")
const Role = require("../model/role")
const{ updateUserDetailsSchema} = require("../shared/validationSchema/userSchema")
const bcrypt=require("bcrypt")

const getUserDetails= async(req,res)=>{
    try {
        const id = req.query.id
        if(!id){
            res.status(400).json({error:"id not found"})
        }
        const data= await User.findById(id).select('-password -emailToken').populate('role')
        res.json(data)
    } catch (error) {
        res.status(500).json({error:"internal server error"})
        console.log(error)
    }
}

const updateUserDetails= async(req,res)=>{
    try {
        const id = req.query.id
        if(!id){
            res.status(400).json({error:"id not found"})
        }
        const {error, value}= await updateUserDetailsSchema.validate(req.body)
       
        if(error){
           return res.status(400).json({error:error.details[0].message})
       }
       let obj= Object.assign({},value)
       if(value.password){
            obj.password=  await bcrypt.hash(value.password, 10);
       }
      
       const updatedUser= await User.findByIdAndUpdate(id, obj, {new:true})
       console.log("UPDATED USER=======", updatedUser, req.body)
       res.json({
        message:"user updated successfully",
        data:updatedUser
       })

    } catch (error) {
        res.status(500).json({error:"internal server error"})
        console.log(error)
    }
}

const getAllUsers= async(req,res)=>{

    try {
        const { role, status,sortBy, sortOrder } = req.query;
        let sort = { createdAt: -1 }; // default sort by createdAt
       
        const filter = {};
        if (sortBy && sortOrder) {
          // if sortBy and sortOrder are provided in query, use those for sorting
          sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
        }
        if (status) filter.status = status;
        
        if(role==="team"){
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 25;
            let skip = (page - 1) * limit;
            let sort = { createdAt: -1 }; // default sort by createdAt
            const count = await User.countDocuments(filter);
            if (count <= limit) {
                skip = 0;
              }
          const data = await User.find({ "role.role": { $ne: "user" } })
                            .sort(sort)
                            .skip(skip)
                            .limit(limit)
                            .select('-password -emailToken')
                            .populate('role');
                res.json({
                    data,
                    page: parseInt(page) || 1,
                    pages: Math.ceil(count / limit),
                    limit: parseInt(limit) || 25,
                    total: count,
                    });
            
        } else {
          const roleObj = await Role.findOne({ role: role });
          if (roleObj) {
            filter.role = roleObj._id;
          } else {
            // Return empty array if role is not found
            return res.status(200).json([]);
          }
      
         console.log(filter)
         const page = parseInt(req.query.page) || 1;
         const limit = parseInt(req.query.limit) || 25;
         let skip = (page - 1) * limit;
         const count = await User.countDocuments(filter);
         if (count <= limit) {
             skip = 0;
           }
          const data = await User.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('-password -emailToken')
            .populate('role');
      
          res.json({
            data,
            page: parseInt(page) || 1,
            pages: Math.ceil(count / limit),
            limit: parseInt(limit) || 25,
            total: count,
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
}

const userGain = async(req,res)=>{

const twelveMonthsAgo = new Date();
twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
try {
  const usersGained = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
      },
    },
    {
      $unwind: "$role",
    },
    {
      $match: {
        "role.role": "user",
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const userGainedResponse = usersGained.map((result) => {
    const monthName = new Date(Date.UTC(0, result._id - 1, 1)).toLocaleString(
      "default",
      { month: "long" }
    );
    return { month: monthName, count: result.count };
  });

  const userRole = await Role.findOne({ role: "user" });
  const totalUsers = await User.countDocuments({
    role: userRole._id,
  });

  // const userRole = await Role.findOne({ role: "user" });

  let totalMembers = await User.countDocuments({});
  let totalTeamMembers= totalMembers-totalUsers
  return res.json({ userGainedResponse, totalUsers ,totalTeamMembers});
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "Server error" });
}


}

module.exports={
    getUserDetails,
    updateUserDetails,
    getAllUsers,
    userGain
}