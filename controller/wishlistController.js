const ProductModel = require('../models/productModel');
const wishlistModel = require('../models/wishlistModel');
const WishlistModel = require('../models/wishlistModel');


const addToWishlistPost = async (req, res) => {
    try {
        const productId = req.query.id
        if (req.session.userLogedIn) {
            const userId = req.session.userId
            const wishData = await WishlistModel.findOne({ user_id: userId })
            const productData = await ProductModel.findOne({ _id: productId })
            if (productData.stockQuantity > 0) {
                if (productData.status) {
                    if (wishData) {
                        const exist = wishData.products.filter((value) => value.product_id.toString() == productId)
                        if (exist.length !== 0) {
                            await WishlistModel.updateOne({ user_id: userId, "products.product_id": productId }, { $pull: { products: { product_id: productId } } })
                            res.status(200).json({ success: true, message: 'removed from 🤍',status:'removed' });
                        } else {
                            await WishlistModel.updateOne({ user_id: userId }, { $push: { products: { product_id: productId } } })
                            res.status(200).json({ success: true, message: 'added to 🤍',status:'added' });
                        }
                    } else {
                        const products = {
                            product_id: productId
                        }
                        const wishlistSave = new WishlistModel({
                            products: [products],
                            user_id: userId,
                        })
                        await wishlistSave.save()
                        res.status(200).json({ success: true, message: 'Added to 🤍',status:'added' });
                    }
                }
            } else {
                res.status(200).json({ success: false, message: 'Product Not available' });
            }
        } else {
            res.status(200).json({ success: false, message: 'need to login', redirectUrl: '/login' });
        }

    } catch (error) {
        console.log(error);
    }
}
const wishlistGet = async (req, res) => {
    try {
        const userId = req.session.userId
        const wishList = await wishlistModel.findOne({ user_id: userId }).populate("products.product_id")
        if (wishList) {
            wishList.products.forEach((row, index) => {

            })
        }

        res.render('users/wishlist', {
            message: '',
            user: req.session.user,
            count: req.cartCount,
            wishList
        })

    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    addToWishlistPost,
    wishlistGet
}