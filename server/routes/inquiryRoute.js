const express = require("express");
const route = express.Router();

const {
    getInquiryDetails, 
    getAllInquiries,
    updateInquiryDetails,
    createInquiryDetails,
    getInquirySalesReport
} = require('../controller/inquiryController');
const { verifyAccessToken } = require("../shared/jwt");



route.route("/").get(verifyAccessToken, getAllInquiries)
route.route("/").post(createInquiryDetails)
route.route("/").put(verifyAccessToken, updateInquiryDetails)
route.route("/getbyId").get(verifyAccessToken, getInquiryDetails)
route.route("/report").get(verifyAccessToken, getInquirySalesReport)




module.exports = route