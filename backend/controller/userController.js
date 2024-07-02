

const userModel=require("../models/userModel")
const bcrypt=require("bcrypt")
const {createToken,verifyToken}=require("../utils/jwt")
const login=async(req,res,next)=>{
    try{
        const { email, password } = req.body;
        const exist = await userModel.findOne({ email: email });
        if (exist) {
          if (exist.isBlocked) {
            const error = new Error(
              "You are temporarily suspended. Please contact officials."
            );
            error.statusCode = 403;
            throw error;
          } else {
            const matched = await bcrypt.compare(password, exist.password);
            if (matched) {
              const token = await createToken(exist._id);
              const userPass = {
                id: exist.id,
                name: exist.name,
                email: exist.email,
                mobile: exist.mobile,
                age: exist.age,
                image: exist.image,
              };
              if (token) {
                res
                  .status(200)
                  .json({ success: { token: token, data: userPass } });
              }
            } else {
              const error = new Error("Invalid Credentials!!");
              error.statusCode = 400;
              throw error;
            }
          }
        }

    }
    catch(error){
        next(error)
    }


}

const signUp=async(req,res,next)=>{
    try{
         const { name, email, mobile, age, password, cpassword } = req.body;
         if(password===cpassword){
            const exist= await userModel.findOne({email:email})
            if(!exist){
                const hashedPassword=await bcrypt.hash(password,10)
                const user=await userModel.create({
                    name,
                    email,
                    age,
                    mobile,
                    password:hashedPassword
                })
                console.log("created",user)
                res.json({success:"Registered"})
            }else{
                throw new Error("Account exists")
            }

         }else{
            throw new Error("incorrect password")
         }

    }catch(error){
        console.log(error.message)
    }

}
const profileUpdate=async(req,res,next)=>{
    try{
        console.log(req.body)
        console.log(req.file)
        console.log(req.user)
        if(req.file){
            const Image = "http://localhost:4000/assets/"+req.file.filename
            await userModel.updateOne({_id:req.user},{
                name:req.body.name,
                email:req.body.email,
                age:req.body.age,
                mobile:req.body.mobile,
                image:Image
            })
        }else{
              await userModel.updateOne(
                { _id: req.user },
                {
                  name: req.body.name,
                  email: req.body.email,
                  age: req.body.age,
                  mobile: req.body.mobile,
                  
                }
              );

        }
        const updatedData=await userModel.findOne({_id:req.user})
         const user = {
           name: updatedData.name,
           email: updatedData.email,
           mobile: updatedData.mobile,
           age: updatedData.age,
           image: updatedData.image,
         };
         res.status(200).json({ success: user });

    }
    catch(error){
        console.log(error)
        next(error)
    }

}
module.exports={
    signUp,
    login,
    profileUpdate
}