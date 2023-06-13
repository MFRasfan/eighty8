const express = require("express");
const route = express.Router();

const  {
    getUserDetails, 
    getAllUsers,
    updateUserDetails,
    userGain,
} = require('../controller/userController');
const { verifyAccessToken } = require("../shared/jwt");


route.route("/").get(verifyAccessToken, getAllUsers)
route.route("/").put(verifyAccessToken, updateUserDetails)
route.route("/getById").get(verifyAccessToken, getUserDetails)
route.route("/user-gain").get(verifyAccessToken, userGain)




module.exports = route