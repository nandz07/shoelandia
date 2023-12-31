const CategoryModel = require('../models/categoryModel');
const ProductModel = require('../models/productModel');
const CartModel = require('../models/cartModel');

function offerPriceF(oPrice,oOffer){
    let price=oPrice
    let offer=oOffer
    let offerPrice= price-((price/100)*offer)
    return offerPrice
}

const productDetailsAdminGet = async (req, res) => {
    try {
        let productDb = await ProductModel.find().populate("category").exec()
        res.render('admin/productDetails', { product: productDb, message: '', admin: req.session.admin })
    } catch (error) {
        console.log(error);
    }
}

const addProductAdminGet = async (req, res) => {
    try {
        let categoryDb = await CategoryModel.find({ status: true }).exec()
        res.render('admin/addProduct', {
            category: categoryDb,
            message: '', admin: req.session.admin
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
            res.render('admin/addProduct', { category: categoryDb, message: `Product ${req.body.productName} added successfully`, status: "success", admin: req.session.admin });
        } else {
            res.render('admin/addProduct', { message: "Failed adding product", status: "danger", admin: req.session.admin });
        }
    } catch (error) {
        console.log(error);
    }
}

const editProductDetailsAdminGet = async (req, res) => {
    try {
        const productId = req.params.id
        const productData = await ProductModel.findOne({ _id: productId }).populate("category").exec()
        let categoryDb = await CategoryModel.find({ status: true }).exec()
        res.render('admin/editProduct', { product: productData, category: categoryDb, admin: req.session.admin })
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
        let productDb = await ProductModel.find().populate("category").exec()
        if (productUpdate) {
            res.render('admin/productDetails', { product: productDb, message: 'product has been edited sucessfully', status: 'success', admin: req.session.admin })
        } else {
            res.render('admin/productDetails', { product: productDb, message: `product updation failed`, status: 'danger', admin: req.session.admin })
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
        let productDb = await ProductModel.find().populate("category").exec()
        if (productUpList) {
            res.render('admin/productDetails', { message: `unlisted sucessfully`, status: 'success', product: productDb, admin: req.session.admin })
        } else {
            res.render('admin/productDetails', { message: `failed to unlist`, status: 'danger', product: productDb, admin: req.session.admin })
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
        let productDb = await ProductModel.find().populate("category").exec()
        if (productUpList) {
            res.render('admin/productDetails', { message: `listed sucessfully`, status: 'success', product: productDb, admin: req.session.admin })
        } else {
            res.render('admin/productDetails', { message: `failed to unlisted`, status: 'danger', product: productDb, admin: req.session.admin })
        }
    } catch (error) {
        console.log(error);
    }
}

const productOfferUpdate = async (req, res) => {
    try {
        let id = req.query.id
        let offer = req.body.offer
        const offerUpdate = await ProductModel.findByIdAndUpdate(id, {
            offer: offer
        })  
        let productData=await ProductModel.findOne({_id:id})
        let offerPrice=offerPriceF(productData.price,productData.offer)
        await CartModel.updateMany({"products.product_id": id }, { $set: {  "products.$.price": offerPrice}})
        let cart=await CartModel.find({"products.product_id":id})
        console.log(cart.products);
        
        if (offerUpdate) {
            res.status(200).json({ success: true, message: `offer updated as ${offer}`});
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
    listProductDetailsAdminGet,
    productOfferUpdate
}