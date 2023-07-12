
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const cartController = require('../controller/cartController');
const midData = require('../middleware/midData');


// // Route: GET /users/                
router.get('/',midData.midData, userController.homeGet);
router.get('/productDetailsUser/:id',midData.midData, userController.productDetailsGetUser);
router.get('/login',midData.midData, userController.userLoginGet);
router.get('/userSignUp',midData.midData, userController.userSignUpGet);
router.get('/otpVerificationGet',midData.midData, userController.otpVerificationGet);
router.get('/userSignUpGet',midData.midData, userController.userSignUpGet);
router.get('/logout',midData.midData, userController.userLogoutGet);
router.get('/addToCart', cartController.addTocartPost);
router.get('/Cart',midData.midData, cartController.userCartGet);

// post
router.post('/userSignupPost', userController.userSignupPost);
router.post('/login', userController.userLoginPost);
router.post('/otpVerificationPost', userController.otpVerificationPost);
router.post('/incrementQty', cartController.incrementQty);
router.get('/removeCart', cartController.removeCart);


module.exports = router;


