
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


// // Route: GET /users/                
router.get('/', userController.homeGet);
router.get('/productDetailsUser/:id', userController.productDetailsGetUser);
router.get('/userLogin', userController.userLoginGet);
router.get('/userSignUp', userController.userSignUpGet);
router.get('/otpVerificationGet', userController.otpVerificationGet);
router.get('/userSignUpGet', userController.userSignUpGet);
router.get('/userLogout', userController.userLogoutGet);

// post
router.post('/userSignupPost', userController.userSignupPost);
router.post('/userLoginPost', userController.userLoginPost);
router.post('/otpVerificationPost', userController.otpVerificationPost);


module.exports = router;


