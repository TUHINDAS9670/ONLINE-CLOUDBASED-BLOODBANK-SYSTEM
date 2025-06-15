const express=require('express')
const { authMiddleware } = require('../middlewares/authMiddleware')
const { getDonorListController, getHospitalListController, getOrgListController,  deleteDonorController, getAdminListController } = require('../controllers/adminController')
const {adminMiddleware} = require('../middlewares/adminMiddleware')




//router object
const router=express.Router()
//Routes
router.get("/org-list", authMiddleware, getOrgListController);

//GET||DONOR LIST
router.get('/donor-list',authMiddleware,adminMiddleware, getDonorListController);
//GET || HOSPITAL LIST
router.get("/hospital-list",
  authMiddleware,
  adminMiddleware,
  getHospitalListController
);
//GET || ORGANISATION LIST
router.get("/org-list",
  authMiddleware,
  adminMiddleware,
  getOrgListController
);
router.get("/admin-list",
  authMiddleware,
  adminMiddleware,
 getAdminListController
);
//========================================
// DELETE DONAR || GET
router.delete('/delete-donor/:id',authMiddleware,adminMiddleware,deleteDonorController)


//EXPORT
module.exports=router;