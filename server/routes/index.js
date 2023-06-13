const API_ROUTE="/api"


const router= (app) =>{
    app.use(`${API_ROUTE}/role`,  require("./roleRoute")) 
    app.use(`${API_ROUTE}/auth`,  require("./authRoute"))
    app.use(`${API_ROUTE}/user`,  require("./userRoute")) 
    app.use(`${API_ROUTE}/vehicle`,  require("./vehicleRoute")) 
    app.use(`${API_ROUTE}/inquiry`,  require("./inquiryRoute")) 
    app.use(`${API_ROUTE}/media`,  require("./mediaRoute")) 
    app.use(`${API_ROUTE}/content`,  require("./webContent")) 
    app.use(`${API_ROUTE}/notifications`,  require("./notifications"))


}

module.exports= router