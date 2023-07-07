
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const cartController = require('../controller/cartController');


// // Route: GET /users/                
router.get('/', userController.homeGet);
router.get('/productDetailsUser/:id', userController.productDetailsGetUser);
router.get('/login', userController.userLoginGet);
router.get('/userSignUp', userController.userSignUpGet);
router.get('/otpVerificationGet', userController.otpVerificationGet);
router.get('/userSignUpGet', userController.userSignUpGet);
router.get('/userLogout', userController.userLogoutGet);
router.get('/addToCart/:id', cartController.addTocartPost);

// post
router.post('/userSignupPost', userController.userSignupPost);
router.post('/login', userController.userLoginPost);
router.post('/otpVerificationPost', userController.otpVerificationPost);


module.exports = router;


