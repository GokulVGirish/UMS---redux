const express=require("express")
const router=express.Router()
const userController=require("../controller/userController")
const upload=require("../utils/multer")
const { isLogin } = require("../middleware/userAuth")
router.post("/signup",userController.signUp)
router.post("/login",userController.login)
router.post("/profileUpload", isLogin, upload.single("image"),userController.profileUpdate);


module.exports=router