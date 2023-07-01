const CategoryModel = require('../models/categoryModel');
const SizeModel = require('../models/sizeModel');
const ProductModel = require('../models/productModel');
const productDetailsAdminGet = async (req, res) => {
    try {
        let productDb = await ProductModel.find().exec()
        res.render('admin/productDetails', { product: productDb, message: '' })
    } catch (error) {
        console.log(error);
    }
}
const addProductAdminGet = async (req, res) => {
    try {
        let categoryDb = await CategoryModel.find().exec()
        res.render('admin/addProduct', {
            category: categoryDb,
            message: ''
        })
    } catch (error) {
        console.log(error);
    }
}
const addProductAdminPost = async (req, res) => {
    try {
        const image = []
        for (let i = 0; i < req.files.length; i++) {
            image[i] = req.files[i].filename;
        }
        const product = new ProductModel({
            productName: req.body.productName,
            price: req.body.productPrice,
            image: image,
            category: req.body.productCategory,
            stockQuantity: req.body.productStock,
            status: req.body.status,
            description: req.body.productDescription,
            createdOn: Date.now(),
            updatedOn: Date.now()
        })

        const productData = await product.save();
        let categoryDb = await CategoryModel.find().exec()
        if (productData) {
            res.render('admin/addProduct', { category: categoryDb, message: `Product ${req.body.productName} added successfully`, status: "success" });
        } else {
            res.render('admin/addProduct', { message: "Failed adding product", status: "danger" });
        }
    } catch (error) {
        console.log(error);
    }
}
const editProductDetailsAdminGet = async (req, res) => {
    try {
        const productId = req.params.id
        const productData = await ProductModel.findOne({ _id: productId })
        let categoryDb = await CategoryModel.find().exec()
        res.render('admin/editProduct', { product: productData, category: categoryDb })
    } catch (error) {
        console.log(error);
    }
}
const editProductDetailsAdminPost = async (req, res) => {
    try {
        if (req.files.length > 0) {
            var image = []
            for (let i = 0; i < req.files.length; i++) {
                image[i] = req.files[i].filename;
            }
        } else {
            var img = req.body.old_image;
            var filenames = img.split(',');
            var image = [];
            for (var i = 0; i < filenames.length; i++) {
                image.push(filenames[i]);
            }
        }
        const id = req.params.id
        const productUpdate = await ProductModel.findByIdAndUpdate(id, {
            productName: req.body.productName,
            price: req.body.productPrice,
            image: image,
            category: req.body.productCategory,
            stockQuantity: req.body.productStock,
            status: req.body.status,
            description: req.body.productDescription,
            updatedOn: Date.now()
        })
        let productDb = await ProductModel.find().exec()
        if (productUpdate) {
            res.render('admin/productDetails', { product: productDb, message: '' })
        } else {
            res.render('admin/productDetails', { product: productDb, message: `product updation failed`, status: 'danger' })
        }

    } catch (error) {
        console.log(error);
    }
}
const unlistProductDetailsAdminGet = async (req, res) => {
    try {
        const id = req.params.id
        const productUpList = await ProductModel.findByIdAndUpdate(id, {
            status: false,
            updatedOn: Date.now()
        }).exec();
        let productDb = await ProductModel.find().exec()
        if (productUpList) {
            res.render('admin/productDetails', { message: `unlisted sucessfully`, status: 'success', product: productDb })
        } else {
            res.render('admin/productDetails', { message: `failed to unlist`, status: 'danger', product: productDb })
        }
    } catch (error) {
        console.log(error);
    }
}
const listProductDetailsAdminGet = async (req, res) => {
    try {
        const id = req.params.id
        const productUpList = await ProductModel.findByIdAndUpdate(id, {
            status: true,
            updatedOn: Date.now()
        }).exec();
        let productDb = await ProductModel.find().exec()
        if (productUpList) {
            res.render('admin/productDetails', { message: `listed sucessfully`, status: 'success', product: productDb })
        } else {
            res.render('admin/productDetails', { message: `failed to unlisted`, status: 'danger', product: productDb })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    productDetailsAdminGet,
    addProductAdminGet,
    addProductAdminPost,
    editProductDetailsAdminGet,
    editProductDetailsAdminPost,
    unlistProductDetailsAdminGet,
    listProductDetailsAdminGet
}