const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const productController = require('../controller/productController')
const colorController = require('../controller/colorController')
const brandController = require('../controller/brandsController')
const categoryController = require('../controller/categoryController')
const sizeController = require('../controller/sizeController')

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
router.get('/', adminController.dashboardAdminGet);
router.get('/banner', adminController.bannerAdminGet);

router.get('/productDetails', productController.productDetailsAdminGet);
router.get('/addProduct', productController.addProductAdminGet);
router.get('/editProductDetails/:id', productController.editProductDetailsAdminGet);
router.get('/unlistProduct/:id', productController.unlistProductDetailsAdminGet);
router.get('/listProduct/:id', productController.listProductDetailsAdminGet);


router.get('/productColor', colorController.productColorAdminGet);
router.get('/addColor', colorController.addColorAdminGet);
router.get('/productBrand', brandController.productBrandAdminGet);
router.get('/addBrand', brandController.addBrandAdminGet);
router.get('/productCategory', categoryController.productCategoryAdminGet);
router.get('/editCategory/:id', categoryController.editCategoryAdminGet);
router.get('/deleteCategory', categoryController.deleteCategoryAdminGet);
router.get('/unlistCategory/:id', categoryController.unlistCategoryAdminGet);
router.get('/listCategory/:id', categoryController.listCategoryAdminGet);

router.get('/productSize', sizeController.productSizeAdminGet);
router.get('/addProductSize', sizeController.addSizeAdminGet);
router.get('/editProductSize/:id', sizeController.editProductSizeAdminGet);
router.get('/listSize/:id', sizeController.listSizeAdminGet);
router.get('/unlistSize/:id', sizeController.unlistSizeAdminGet);
// router.get('/deleteProductSize', sizeController.deleteCategoryAdminGet);


// post
router.post('/addProduct',upload.array('image',10), productController.addProductAdminPost);
router.post('/editproductPost/:id',upload.array('image',10), productController.editProductDetailsAdminPost);

router.post('/addColor', colorController.addColorAdminPost);
router.post('/addCategory', categoryController.addCategoryAdminPost);
router.post('/editCategoryPost/:id', categoryController.editCategoryAdminPost);
router.post('/deleteCategory/:id', categoryController.deleteCategoryAdminGet);

router.post('/addProductSize', sizeController.addSizeAdminPost);
router.post('/editProductSize/:id', sizeController.editProductSizeAdminPost);

module.exports = router