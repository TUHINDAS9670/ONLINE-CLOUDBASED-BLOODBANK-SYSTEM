const express=require ('express') 

const {registerController,loginController,currentUserController,updateProfileController,updateUserProfileController, changePasswordController}=require('../controllers/authController')
const{authMiddleware}=require('../middlewares/authMiddleware')
const router =express.Router()

//routes
//register->post
router.post('/register',registerController )
//login->post
router.post('/login',loginController)
//GET CURRENT USER -> GET
router.get('/current-user', authMiddleware, currentUserController)
router.put("/update-profile", updateProfileController);
//update user profile
router.put("/update-profile", authMiddleware, updateUserProfileController);
router.put("/change-password", authMiddleware, changePasswordController);

module.exports=router
