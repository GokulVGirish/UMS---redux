const jwt=require("jsonwebtoken")

const createToken=(id)=>{
  const secret = process.env.ACCESS_TOCKEN_SECRET
  const token=jwt.sign({id:id},secret,{expiresIn:"1h"})
  return token
}
const verifyToken=(token)=>{
      const secret = process.env.ACCESS_TOCKEN_SECRET;
     const verified= jwt.verify(token,secret,(error,id)=>{
         if(error){
            return false
         }
         return id
      })
      return verified


}
module.exports={
    createToken,
    verifyToken
}