const Role = require("../model/role")
const { roleSchema, updateRoleSchema } = require("../shared/validationSchema/roleSchema")

const updateRoleDetails= async(req,res)=>{
    try {
        const id = req.query.id
        if(!id){
            res.status(400).json({error:"id not found"})
        }
        const {error, value}= await updateRoleSchema.validate(req.body)
       
        if(error){
            res.status(400).json({error:error.details[0].message})
       }
       
      
       const updatedRole= await Role.findByIdAndUpdate(id, value, {new:true})
       res.json({
        message:"role updated successfully",
        data:updatedRole
       })

    } catch (error) {
        res.status(500).json({error:"internal server error"})
        console.log(error)
    }
}

const getAllRoles= async(req,res)=>{
    try {
        const data= await Role.find({})
        res.json(data)
    } catch (error) {
        res.status(500).json({error:"internal server error"})
        console.log(error)
    }
}

const createRoleDetails= async(req,res)=>{
    try {
        const {value,error} =roleSchema.validate(req.body)
        if(error){
            res.status(400).json({error:error.details[0].message})
        }

        const roleExist =await Role.findOne({role:value.role})

        if (roleExist) {
            return res.status(409).json({ message: 'role already exists' });
          }
        const newRole = new Role(value);
        await newRole.save();
        res.status(201).json({message:"Role created successfully"})

    } catch (error) {
        res.status(500).json({error:"internal server error"})
        console.log(error)
    }
}

module.exports={
    getAllRoles,
    updateRoleDetails,
    createRoleDetails
}