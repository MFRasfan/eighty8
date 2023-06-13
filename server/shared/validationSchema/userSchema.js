const Joi = require("joi");

const updateUserDetailsSchema= Joi.object().keys({
    image:Joi.string(),
    firstName:Joi.string(),
    lastName:Joi.string(),
    isEmailVerified: Joi.bool(),
    phone:Joi.string().min(13),
    role:Joi.string(),
    status:Joi.string().valid('active','inactive'),
    password:Joi.string().min(8)
})

module.exports= {updateUserDetailsSchema}