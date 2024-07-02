
const errorHandler=(error,req,res,next)=>{
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ error: error.message || "Internal Server Error!!" });

}
module.exports={errorHandler}