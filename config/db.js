const mongoose = require("mongoose")
require("dotenv").config()

const connectdb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("✅ Database connected successfully");

    } catch (error) {
        res.send({Message : "Database connection error",error})
    }
}

module.exports = connectdb