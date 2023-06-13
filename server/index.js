const express = require("express")
const cors = require("cors")
const useRouter = require("./routes")
const { connectDB } = require("./database");
require('dotenv').config();

const PORT= process.env.PORT

const app = express()
app.use(cors())
app.use(express.json({urlencoded:true}))
app.use('/uploads', express.static('uploads'));

connectDB()
useRouter(app)


app.listen(PORT,()=>console.log(`Server is running on ${PORT} `))