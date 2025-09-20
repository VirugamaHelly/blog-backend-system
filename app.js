const express = require("express")
require("dotenv").config();
const connectdb = require("./config/db");
const UserRouter = require("./Router/UserRouter");
const blogrouter = require("./Router/BlogRoutes");
const path = require("path");
const cookieParser = require('cookie-parser');


const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","ejs")
app.use(cookieParser());

app.use("/user",UserRouter)
app.use("/Blog",blogrouter)
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

connectdb()

app.get("/",(req,res)=>{
    const user = null; 
    res.render("Navbar", { user});
})


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})