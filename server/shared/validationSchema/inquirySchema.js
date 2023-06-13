const Joi = require('joi')


const addInquirySchema= Joi.object().keys({
    customerId:Joi.string().required(),
    vehicleId:Joi.string(),
    message:Joi.string().required(),
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
    email:Joi.string().required(),
    phone:Joi.string().required(),
    message:Joi.string().required()
})

const guestInquirySchema=Joi.object().keys({
    vehicleId:Joi.string(),
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
    email:Joi.string().required(),
    phone:Joi.string().required(),
    message:Joi.string().required()
})
const assigneSchema= Joi.object().keys({
    details:Joi.object(),
    images:Joi.array(),
    status:Joi.string().default("active")
})

module.exports= { addInquirySchema, assigneSchema, guestInquirySchema }