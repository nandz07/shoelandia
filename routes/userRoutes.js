
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// // Route: GET /users/                
router.get('/', userController.homeGet);
router.get('/productDetailsUser/:id', userController.productDetailsGetAdmin);




module.exports = router;


