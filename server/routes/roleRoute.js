const express = require("express");
const route = express.Router();

const {
    getAllRoles,
    updateRoleDetails,
    createRoleDetails,
    
} = require('../controller/RoleController');
const { verifyAccessToken } = require("../shared/jwt");



route.route("/").get(verifyAccessToken, getAllRoles)
route.route("/").post(verifyAccessToken, createRoleDetails)
route.route("/").put(verifyAccessToken, updateRoleDetails)





module.exports = route