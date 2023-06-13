const express = require("express");
const route = express.Router();

const {
    getVehicleDetails, 
    getAllVehicles,
    updateVehicleDetails,
    createVehicleDetails,
    searchVehicles,
    getFilteredAndPaginatedRecords
    
} = require('../controller/vehicleController');
const { verifyAccessToken } = require("../shared/jwt");



route.route("/").get( getAllVehicles)
route.route("/").post( createVehicleDetails)
route.route("/").put( updateVehicleDetails)
route.route("/getbyId").get(getVehicleDetails)
route.route("/filter").post(getFilteredAndPaginatedRecords)
route.route("/search").get(searchVehicles)






module.exports = route