const express = require('express');

const{authMiddleware}=require('../middlewares/authMiddleware')
const { createInventoryController, getInventoryController, getDonorsController, getHospitalsController, getOrganisationsController, getOrganisationsForHospitalsController, getInventoryHospitalController, getRecentInventoryController,getPublicInventory } = require('../controllers/inventoryController');

const router = express.Router();

// Add inventory -> POST
router.post('/create-inventory', authMiddleware, createInventoryController);
//get inventory->get || get all blood records
router.get('/get-inventory',authMiddleware,getInventoryController)
// get hospital blood records
router.post('/get-inventory-hospital',authMiddleware,getInventoryHospitalController)
//get recent blood records
router.get('/get-recent-inventory',authMiddleware,getRecentInventoryController)
//get all donor records
router.get('/get-donors',authMiddleware,getDonorsController);
router.post("/public-inventory", getPublicInventory);

//get hospital record
router.get('/get-hospitals',authMiddleware,getHospitalsController)
//get organisations record
router.get('/get-organisations',authMiddleware,getOrganisationsController)
//get organisations record for hospitals
router.get('/get-organisations-for-hospitals',authMiddleware,getOrganisationsForHospitalsController)

module.exports = router;




