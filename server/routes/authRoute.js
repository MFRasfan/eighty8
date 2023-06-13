const express = require("express");
const route = express.Router();

const {
    signup,
    login,
    verifyAccount,
    forgetPassword,
    resetPassword,
    registerStaff,
    confirmForgetPasswordOtp ,
    refreshAccessToken,
} = require('../controller/authController')


route.route("/signup").post(signup)
route.route("/login").post(login)
route.route("/forgetPassword").post(forgetPassword)
route.route("/refreshAccessToken").post(refreshAccessToken)
route.route("/resetPassword").post(resetPassword)
route.route("/verifyaccount").post(verifyAccount)
route.route("/registerStaff").post(registerStaff)
route.route("/confirmForgetOTP").post(confirmForgetPasswordOtp )


module.exports = route