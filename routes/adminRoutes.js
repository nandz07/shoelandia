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
router.get('/editCategory/:id', categoryController.editCategoryAdminGet);
router.get('/deleteCategory', categoryController.deleteCategoryAdminGet);
router.get('/unlistCategory/:id', categoryController.unlistCategoryAdminGet);
router.get('/listCategory/:id', categoryController.listCategoryAdminGet);


// post
router.post('/addProduct', productController.addProductAdminGet);
router.post('/addColor', colorController.addColorAdminPost);
router.post('/addCategory', categoryController.addCategoryAdminPost);
router.post('/editCategoryPost/:id', categoryController.editCategoryAdminPost);
router.post('/deleteCategory/:id', categoryController.deleteCategoryAdminGet);

module.exports=router