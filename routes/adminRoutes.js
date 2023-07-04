const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const productController = require('../controller/productController')
const colorController = require('../controller/colorController')
const brandController = require('../controller/brandsController')
const categoryController = require('../controller/categoryController')
const sizeController = require('../controller/sizeController')
const userController = require('../controller/userDetailscontroller')
const session = require('express-session');
const auth = require('../middleware/adminauthentication');
const nocache = require('nocache');
router.use(nocache())


router.use(session({
    secret:process.env.SESSION,
    saveUninitialized: true,
    resave: false
}))

// image storage
const multer = require('multer');
const fs=require('fs')
const path=require('path')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        let dir=path.join(__dirname,'../public/admin/productImages')
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        cb(null,dir)
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})
const upload = multer({storage:storage});

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


router.get('/productColor', auth.isLogin,colorController.productColorAdminGet);
router.get('/addColor',auth.isLogin, colorController.addColorAdminGet);
router.get('/productBrand', auth.isLogin,brandController.productBrandAdminGet);
router.get('/addBrand',auth.isLogin, brandController.addBrandAdminGet);
router.get('/productCategory', auth.isLogin,categoryController.productCategoryAdminGet);
router.get('/editCategory/:id', auth.isLogin,categoryController.editCategoryAdminGet);
router.get('/deleteCategory', auth.isLogin,categoryController.deleteCategoryAdminGet);
router.get('/unlistCategory/:id', auth.isLogin,categoryController.unlistCategoryAdminGet);
router.get('/listCategory/:id',auth.isLogin, categoryController.listCategoryAdminGet);

router.get('/productSize',auth.isLogin, sizeController.productSizeAdminGet);
router.get('/addProductSize', auth.isLogin,sizeController.addSizeAdminGet);
router.get('/editProductSize/:id', auth.isLogin,sizeController.editProductSizeAdminGet);
router.get('/listSize/:id',auth.isLogin, sizeController.listSizeAdminGet);
router.get('/unlistSize/:id', auth.isLogin,sizeController.unlistSizeAdminGet);
// router.get('/deleteProductSize', sizeController.deleteCategoryAdminGet);


// post
router.post('/adminLoginPost', adminController.adminLoginPost);

router.post('/addProduct',upload.array('image',10), productController.addProductAdminPost);
router.post('/editproductPost/:id',upload.array('image',10), productController.editProductDetailsAdminPost);

router.post('/addColor', colorController.addColorAdminPost);
router.post('/addCategory', categoryController.addCategoryAdminPost);
router.post('/editCategoryPost/:id', categoryController.editCategoryAdminPost);
router.post('/deleteCategory/:id', categoryController.deleteCategoryAdminGet);

router.post('/addProductSize', sizeController.addSizeAdminPost);
router.post('/editProductSize/:id', sizeController.editProductSizeAdminPost);

module.exports = router