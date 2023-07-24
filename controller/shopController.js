const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const OtpModel = require('../models/otpModel');
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');
const otpModel = require('../models/otpModel');
const CartModel = require('../models/cartModel');
const CategoryModel = require('../models/categoryModel');
const wishlistModel = require('../models/wishlistModel');
// const UpdateCartModel = require('../models/updateCartModel');


// --------------------------------------
const shopGet = async (req, res) => {
    try {
        let search =req.query.search
        console.log(search)
        if(search){
            search=search
        }else{
            search=null
        }
        const category=await CategoryModel.find({status:true})
        const productDb = await ProductModel.find({ status: true },).populate("category").sort({ createdOn: -1 }).exec();
        let wishList = []
        if (req.session.userLogedIn) {
            wishList = await wishlistModel.find({ user_id: req.session.userId })
            if (wishList.length !=0) {
                wishList[0].products.forEach(wishList => {
                    productDb.forEach(productDb => {
                        if (wishList.product_id.toString() == productDb._id.toString()) {
                            productDb.wishlist = true
                        }
                    });
                });
            }
        } else {
            wishList = []
        }
        res.render('users/shop', {
            product: productDb,
            message: '',
            user: req.session.user,
           search,
            count: req.cartCount,
            category
            
        })
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    shopGet,
    
}