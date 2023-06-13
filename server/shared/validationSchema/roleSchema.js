const Joi = require("joi");

const roleSchema= Joi.object().keys({
    role: Joi.string().valid("admin",'user','manager','sales').required(),
    permissions: Joi.array().default([]),
    status:Joi.string().default("active")
})

const updateRoleSchema= Joi.object().keys({
    permissions: Joi.array().default([]),
    status:Joi.string().default("active")
})

module.exports={
    roleSchema,
    updateRoleSchema
}