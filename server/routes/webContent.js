const express = require("express");
const route = express.Router();

const {
    getHomes,
    createHome,
    createAbout,
    getAbout,
    createFAQ,
    getFAQ,
    updataFAQ,
    createContact,
    getContact
} = require('../controller/webContentController');
const { verifyAccessToken } = require("../shared/jwt");



route.route("/home").get(getHomes)
route.route("/home").post(createHome)


route.route("/about").get(getAbout)
route.route("/about").post(createAbout)


route.route("/contact").get(getContact)
route.route("/contact").post(createContact)



route.route("/faq").get(getFAQ)
route.route("/faq").post(createFAQ)
route.route("/faq").put(updataFAQ)




module.exports = route