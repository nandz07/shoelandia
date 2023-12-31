
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const cartController = require('../controller/cartController');
const orderController = require('../controller/orderController');
const wishlistController = require('../controller/wishlistController');
const shopController = require('../controller/shopController');
const midData = require('../middleware/midData');
const auth = require('../middleware/userAuth')



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
router.get('/checkout',midData.midData, orderController.checkoutLoad);
router.get('/addAdress',midData.midData, orderController.addAdress);
router.get('/editAddress',auth.verify_user,midData.midData, orderController.editAddressGet);
router.get('/myOrder',auth.verify_user,midData.midData, orderController.myOrders);
router.get('/resendOtp',midData.midData, userController.resendOtpGet);
router.get('/wishlist',auth.verify_user,midData.midData, wishlistController.wishlistGet);
router.get('/changePassword',midData.midData, userController.changePasswordGet);
router.get('/shop',midData.midData, shopController.shopGet);
router.get('/userProfile',auth.verify_user,midData.midData, userController.userProfile);

// post
router.post('/userSignupPost', userController.userSignupPost);
router.post('/login', userController.userLoginPost);
router.post('/forgotPasswordEmail', userController.forgotPasswordEmail);
router.post('/otpVerificationPost', userController.otpVerificationPost);
router.post('/incrementQty', cartController.incrementQty);
router.post('/removeCart', cartController.removeCart);
router.post('/addAddress',auth.verify_user,midData.midData, orderController.addAdressPost);
router.post('/checkoutPost',auth.verify_user,midData.midData, orderController.checkoutPost);
router.post('/updateAddress',auth.verify_user,midData.midData, orderController.editAddressPost);
router.post('/deleteAddress',auth.verify_user,midData.midData, orderController.deleteAddress);
router.post('/cancelOrder',auth.verify_user,midData.midData, orderController.cancelOrder);
router.post('/addToWishlistPost',auth.verify_user,midData.midData, wishlistController.addToWishlistPost)
router.post('/changePassword',midData.midData, userController.changePasswordPost);
router.post('/applyCoupon', auth.verify_user,orderController.applyCouponPost);
router.post('/verify-payment', auth.verify_user,orderController.verifyPayment);

router.put('/returnOrder',auth.verify_user,midData.midData, orderController.returnOrder);


router.use((req, res, next) => {
    res.status(404).render('users/404')
  });
module.exports = router;


