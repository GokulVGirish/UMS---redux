const { verifyToken } = require("../utils/jwt");
const userModel = require("../models/userModel");
const isLogin=async(req,res,next)=>{
    try{
        if(req.headers&&req.headers['authorization']){
            const token = req.headers["authorization"].split(" ")[1]
               const decoded = await verifyToken(token);
               if(decoded){
                const user=await userModel.findOne({_id:decoded.id})
                if(user.isBlocked){
                    console.log("vannu")
                     res.status(401).json({ error: "Blocked" });
                }else{
                     req.user = decoded.id;
                     console.log("nextil poi")
                     next();
                }
               }else{
                res.status(401).json({ error: "Unauthorized" });

               }
        }else{
            res.status(401).json({ error: "Unauthorized" });
        }

    }
    catch(error){
         console.log(error.message);
    }

}
module.exports={
    isLogin
}