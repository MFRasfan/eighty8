const Joi = require('joi')


const addVechicleSchema= Joi.object().keys({
    vin:Joi.string().required(),
    details:Joi.required(),
    images:Joi.array().default([])
})

const updateVehicleSchema= Joi.object().keys({
    details:Joi.object(),
    images:Joi.array(),
    status:Joi.string().default("active")
})

module.exports= { addVechicleSchema, updateVehicleSchema }