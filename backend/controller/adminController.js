const userModel=require("../models/userModel")
const bcrypt=require("bcrypt")
const {createToken}=require("../utils/jwt");
const { use } = require("../routes/adminRoutes");
const login=async(req,res,next)=>{

   try{
     const { email, password } = req.body;
     const admin = await userModel.findOne({ email, isAdmin: true });
     if (admin) {
       const verified = await bcrypt.compare(password, admin.password);
       if (verified) {
         const token = await createToken(admin._id);
         const adminData = {
           name: admin.name,
           email: admin.email,
           mobile: admin.mobile,
           age: admin.age,
           image: admin.image,
         };
         res.status(200).json({ token, adminData });
       } else {
         const error = new Error("Invalid Password.");
         error.statusCode = 403;
         throw error;
       }
     } else {
       const error = new Error("Invalid Credentials.");
       error.statusCode = 403;
       throw error;
     }

   }
   catch(error){
    console.log(error)
    next(error)

   }


}
const getUsers=async(req,res,next)=>{
    try{
     
          const users = await userModel.find({ isAdmin: false });
          res.status(200).json({userData:users})

    }catch(error){
        next(error)
      

    }

}
const createUsers=async(req,res,next)=>{
    try{
      const { name, email, mobile, age, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userModel.create({
        name: name,
        mobile: mobile,
        email: email,
        age: age,
        password: hashedPassword,
      });
      const uData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        mobile:user.mobile,
        isBlocked: user.isBlocked,
        image: user.image,
        isAdmin: user.isAdmin,
      };
      res.status(200).json({user:uData})

    }
    catch(error){

      next(error)

    }
}
const editUser=async(req,res,next)=>{
  try{
      const { id, name, email, mobile, age } = req.body;
      console.log(req.body.name)
      let data
      if(req.file){
         data = {
                name,
                email,
                mobile,
                age,
                image:'http://localhost:4000/assets/'+req.file.filename
         }
      }else{

         data = {
                name,
                email,
                mobile,
                age
            }
      }
      await userModel.updateOne({_id:id},data)
      const updatedData=await userModel.findOne({_id:id})
        const userToPass = {
          _id:updatedData._id,
          name: updatedData.name,
          email: updatedData.email,
          mobile: updatedData.mobile,
          age: updatedData.age,
          image: updatedData.image,
        };
        console.log("done")
        console.log(userToPass)
      res.status(200).json({ user: userToPass });


  }
  catch(error){
    next(error)
  }

}
const blockUnblock=async(req,res,next)=>{
  try{
    const { id } = req.query;
    const user = await userModel.findOne({ _id: id });
   
    user.isBlocked = !user.isBlocked;

  
     await user.save();

     res.status(200).json({message:user.isBlocked,id})
  }
  catch(error){
    next(error)
  }
}
const deleteUser=async(req,res,next)=>{
  try{
      const { id } = req.query;
      const deleted=await userModel.findByIdAndDelete(id)
    res.status(200).json({ message: "Deleted", id });

  }
  catch(error){
    next(error)

  }
}
module.exports={
    login,
    getUsers,
    createUsers,
    editUser,
    blockUnblock,
    deleteUser
}