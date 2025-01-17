const express = require('express');
const{authMiddleware}=require('../middlewares/authMiddleware')
const { createInventoryController, getInventoryController } = require('../controllers/inventoryController');

const router = express.Router();

// Add inventory -> POST
router.post('/create-inventory', authMiddleware, createInventoryController);
//get inventory->get
router.get('/get-inventory',authMiddleware,getInventoryController)

module.exports = router;
