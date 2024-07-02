const express=require("express")
const router=express.Router()
const {isLogin} =require("../middleware/adminAuth")
const adminController=require("../controller/adminController")
const upload = require("../utils/multer");
router.post("/login",adminController.login)
router.get("/getusers",isLogin,adminController.getUsers);
router.post("/create",isLogin,adminController.createUsers);
router.put("/edituser",isLogin,upload.single('image'),adminController.editUser);
router.put("/blockunblock",isLogin,adminController.blockUnblock);
router.put("/delete",isLogin,adminController.deleteUser);
module.exports=router