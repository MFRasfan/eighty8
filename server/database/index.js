const mongoose = require("mongoose")


const connectDB= async()=>{
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Mongodb connected")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports={
    connectDB
}