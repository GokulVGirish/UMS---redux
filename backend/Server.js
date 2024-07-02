const express=require("express")
const cors = require("cors");
const path=require("path")
const nocache=require("nocache")
const userRoutes=require("./routes/userRoutes")
const adminRoutes=require("./routes/adminRoutes")
require("dotenv").config({path:"./config.env"})
const {errorHandler}=require("./middleware/errorHandle")



const app=express()
require("./DB/database")

app.use(nocache())
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials:true
  })
);
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use("/",userRoutes)
app.use("/admin",adminRoutes)
app.use(errorHandler)
app.listen(process.env.PORT,()=>{
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})


