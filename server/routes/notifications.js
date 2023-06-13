

const express = require("express");
const route = express.Router();

const {
   getNotifications,
   updateReadStatus
    
} = require('../controller/notification');
const { verifyAccessToken } = require("../shared/jwt");



route.route("/").get(verifyAccessToken,getNotifications)
route.route("/read").get(verifyAccessToken,updateReadStatus)







module.exports = route