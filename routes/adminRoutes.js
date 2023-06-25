const express=require('express')
const router=express.Router()
const adminController=require('../controller/adminController')
const productController=require('../controller/productController')
const colorController=require('../controller/colorController')
const brandController=require('../controller/brandsController')
const categoryController=require('../controller/categoryController')



// get
router.get('/', adminController.dashboardAdminGet);
router.get('/banner', adminController.bannerAdminGet);
router.get('/productDetails', productController.productDetailsAdminGet);
router.get('/addProduct', productController.addProductAdminGet);
router.get('/productColor', colorController.productColorAdminGet);
router.get('/addColor', colorController.addColorAdminGet);
router.get('/productBrand', brandController.productBrandAdminGet);
router.get('/addBrand', brandController.addBrandAdminGet);
router.get('/productCategory', categoryController.productCategoryAdminGet);


// post
router.post('/addProduct', productController.addProductAdminGet);
router.post('/addColor', colorController.addColorAdminPost);

module.exports=router