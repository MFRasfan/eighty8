const vehicles = require("../model/vehicles")
const { addVechicleSchema, updateVehicleSchema } = require("../shared/validationSchema/vehicleSchema")

const getVehicleDetails= async(req,res)=>{
    try {
        const id = req.query.id
        if(!id){
            res.status(400).json({error:"id not found"})
        }
        const data= await vehicles.findById(id)
        res.json(data)
    } catch (error) {
        res.status(500).json({error:"internal server error"})
        console.log(error)
    }
}

const updateVehicleDetails= async(req,res)=>{
    try {
        const id = req.query.id
        if(!id){
            res.status(400).json({error:"id not found"})
        }
        const {error, value}= await updateVehicleSchema.validate(req.body)
       
        if(error){
            res.status(400).json({error:error.details[0].message})
       }
       
      
       await vehicles.findByIdAndUpdate(id, value, {new:true})
       res.json({
        message:"vehicle updated successfully",
       
       })

    } catch (error) {
      console.log(error)
      res.status(500).json({error:"internal server error"})
    }
}

const getAllVehicles= async(req,res)=>{
    try {
        const data= await vehicles.find({})
        res.json(data)
    } catch (error) {
        res.status(500).json({error:"internal server error"})
        console.log(error)
    }
}

const createVehicleDetails= async(req,res)=>{
    try {
        const {value,error} =addVechicleSchema.validate(req.body)
        if(error){
            res.status(400).json({error:error.details[0].message})
        }

        const vinExist =await  vehicles.findOne({vin:value.vin})

        if (vinExist) {
            return res.status(409).json({ message: 'vin number already exists' });
          }
        const newRecord = new vehicles(value);
        await newRecord.save();
        res.status(201).json({message:"vehicle added successfully"})

    } catch (error) {
        res.status(500).json({error:"internal server error"})
        console.log(error)
    }
}

const getFilteredAndPaginatedRecords = async (req, res) => {
    const { page, limit, ...filters } = req.body;
  
    let filterQuery = {};
    if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
      filterQuery["details.sellingPrice"] = {
        // $gte: filters.priceRange[0],
        // $lte: filters.priceRange[1]
        $gte: parseInt(filters.priceRange[0]),
        $lte: parseInt(filters.priceRange[1])
      };
    }
    
    console.log(111, filters, req.body, filters.priceRange, Array.isArray(filters.priceRange) )
    // mileage survey
    if (filters.mileage && Array.isArray(filters.mileage) && filters.mileage.length === 2) {
        filterQuery = {
          $or: [
            {
              $and: [
                { 'details.cityMileageMin': { $lte: filters.mileage[1] } },
                { 'details.cityMileageMax': { $gte: filters.mileage[0] } }
              ]
            },
            {
              $and: [
                { 'details.highwayMileageMin': { $lte:filters.mileage[1] }},
                { 'details.highwayMileageMax': { $gte: filters.mileage[0] } }
              ]
            }
          ]
          };
    }

     

     // Range filtering for year, 
        if (filters.year  && Array.isArray(filters.year) && Number(filters.year.length ) && filters.year.length === 2) {
            const minYear = filters.year[0];
            const maxYear = filters.year[1];
            filterQuery["details.year"] = {
            $gte:  minYear,
            $lte: maxYear
            };
           
        }

         // Range filtering for Seat, 
        //  if (filters.seats ) {
        
        //   filterQuery["details.standard_seating"] = {
        //   $gte: filters.seats,
        //   $lte: filters.seats
        //   };
         
          if (filters.seats && Array.isArray(filters.seats)) {
            filterQuery["details.standard_seating"] = { $in: filters.seats };
          }
      // }

    // Filtering for brands
    if (filters.brands && Array.isArray(filters.brands)) {
      filterQuery["details.make"] = { $in: filters.brands };
    }
 

    // Filtering for colors
    console.log("filters.colors && Array.isArray(filters.colors",filters.colors && Array.isArray(filters.colors))
    if (filters.colors && Array.isArray(filters.colors)) {
      filterQuery["details.color"] = { $in: filters.colors };
    }

     // Filtering for style
     if (filters.style && Array.isArray(filters.style)) {
        filterQuery["details.style"] = { $in: filters.style};
      }
  
        // Filtering for type
     if (filters.bodyType && Array.isArray(filters.bodyType)) {
        filterQuery["details.type"] = { $in: filters.bodyType};
      }
  
        // Filtering for transmission
     if (filters.transmission && Array.isArray(filters.transmission)) {
        filterQuery["details.transmission_type"] = { $in: filters.transmission};
      }
       // Filtering for fuel type
     if (filters.fuelType && Array.isArray(filters.fuelType)) {
        filterQuery["details.fuel_type"] = { $in: filters.fuelType};
      }

       // Filtering for drivetrain
       console.log(filters.drivetrain , filters, Array.isArray(filters.drivetrain))
     if (filters.drivetrain && Array.isArray(filters.drivetrain)) {
        filterQuery["details.drivetrain"] = { $in: filters.drivetrain};
      }
  
        // Filtering for cylinders
     if (filters.cylinders && Array.isArray(filters.cylinders)) {
        filterQuery["details.engine_cylinders"] = { $in: filters.cylinders};
      }
  


    console.log("filter query=============",filterQuery)
  
    try {
      const totalCount = await vehicles.countDocuments(filterQuery);
  
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * limit;
  
      const records = await vehicles.find(filterQuery)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
  
      res.json({
        records,
        currentPage,
        totalPages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

  const searchVehicles = async (req, res) => {
    try {
      const searchQuery = req.query.search;
  
      // Create a regular expression to perform case-insensitive search
      const regex = new RegExp(searchQuery, 'i');
  
      const vehicleList = await vehicles.find({
        $or: [
          { vin: regex },
          { 'details.make': regex },
          { 'details.trim': regex },
          { 'details.style': regex },
          { 'details.type': regex },
          { 'details.size': regex },
          { 'details.made_in': regex },
          { 'details.made_in_city': regex },
          { 'details.fuel_type': regex },
          { 'details.engine': regex },
          { 'details.transmission': regex },
          { 'details.drivetrain': regex },
          { 'details.color': regex },
          { 'details.year': regex },

        ],
        sellingPrice: { $regex: searchQuery, $options: 'i' },
      }).exec();
  
      res.json(vehicleList);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  
module.exports={
    getAllVehicles,
    updateVehicleDetails,
    getVehicleDetails,
    createVehicleDetails,
    searchVehicles,
    getFilteredAndPaginatedRecords
}