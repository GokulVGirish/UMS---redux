const mongoose=require("mongoose")
const connectDB = mongoose.connect(process.env.LOCAL_CONN_MINE);
connectDB.then(()=>{
   console.log("Database Connected");
}).catch((error)=>console.log(error))