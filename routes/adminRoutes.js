const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const productController = require('../controller/productController')
const brandController = require('../controller/brandsController')
const categoryController = require('../controller/categoryController')
const userController = require('../controller/userDetailscontroller')
const auth = require('../middleware/adminauthentication');
const upload=require('../config/multiFileUpload')

// get
router.get('/',auth.isLogin, adminController.dashboardAdminGet);
router.get('/banner',auth.isLogin, adminController.bannerAdminGet);
router.get('/adminLogin', adminController.adminLoginGet);
router.get('/adminLogout', adminController.adminLogoutGet);

router.get('/userDetails',auth.isLogin, userController.userDetailsAdminGet);
router.get('/unlistUser/:id',auth.isLogin, userController.unlistUserDetailsAdminGet);
router.get('/listUser/:id',auth.isLogin, userController.listUserDetailsAdminGet);


router.get('/productDetails',auth.isLogin, productController.productDetailsAdminGet);
router.get('/addProduct', auth.isLogin,productController.addProductAdminGet);
router.get('/editProductDetails/:id', auth.isLogin,productController.editProductDetailsAdminGet);
router.get('/unlistProduct/:id',auth.isLogin, productController.unlistProductDetailsAdminGet);
router.get('/listProduct/:id',auth.isLogin, productController.listProductDetailsAdminGet);





router.get('/productCategory', auth.isLogin,categoryController.productCategoryAdminGet);
router.get('/editCategory/:id', auth.isLogin,categoryController.editCategoryAdminGet);
router.get('/deleteCategory', auth.isLogin,categoryController.deleteCategoryAdminGet);
router.get('/unlistCategory/:id', auth.isLogin,categoryController.unlistCategoryAdminGet);
router.get('/listCategory/:id',auth.isLogin, categoryController.listCategoryAdminGet);




// post
router.post('/adminLoginPost', adminController.adminLoginPost);

router.post('/addProduct',upload.array('image',10), productController.addProductAdminPost);
router.post('/editproductPost/:id',upload.array('image',10), productController.editProductDetailsAdminPost);

router.post('/addCategory', categoryController.addCategoryAdminPost);
router.post('/editCategoryPost/:id', categoryController.editCategoryAdminPost);
router.post('/deleteCategory/:id', categoryController.deleteCategoryAdminGet);


router.use((req, res, next) => {
    res.status(404).send('404');
  });
module.exports = router