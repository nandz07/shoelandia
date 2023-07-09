const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');

const otpModel = require('../models/otpModel');
const userModel = require('../models/userModel');
const WalletModel = require('../models/walletModel');
const CartModel = require('../models/cartModel');


const addTocartPost = async (req, res) => {
    try {
        const productId = req.query.id
        if (req.session.userLogedIn) {
            const userId=req.session.userId
            const cartData = await CartModel.findOne({ user_id: userId })
            const productData = await ProductModel.findOne({ _id: productId })
            console.log(productData.price,);

            if (productData.status) {
                const products = {
                    product_id: productId,
                    quantity: 1,
                    price: productData.price,
                    totalPrice: productData.price
                }

                if (cartData) {
                    const exist = cartData.products.filter((value) => value.product_id.toString() == productId)
                    if (exist.length !== 0) {
                        await CartModel.findOneAndUpdate({ user_id: userId, "products.product_id": productId }, { $inc: { "products.$.quantity": 1 } })
                        res.redirect('/')
                    } else {
                        await CartModel.updateOne({ user_id: userId }, { $push: { products: { product_id: productId, quantity: 1, price: productData.price, totalPrice: productData.price } } })
                        res.redirect('/')
                    }

                } else {
                    const cartSave = new CartModel({
                        products: [products],
                        user_id: userId
                    })
                    await cartSave.save()
                    res.redirect('/')
                }

            } else {
                res.redirect('/');

            }
        }else{
            const session_id=req.sessionID
            const cartData = await CartModel.findOne({ session_id: session_id })
            const productData = await ProductModel.findOne({ _id: productId })
            console.log(productData.price,);

            if (productData.status) {
                const products = {
                    product_id: productId,
                    quantity: 1,
                    price: productData.price,
                    totalPrice: productData.price
                }

                if (cartData) {
                    const exist = cartData.products.filter((value) => value.product_id.toString() == productId)
                    if (exist.length !== 0) {
                        await CartModel.findOneAndUpdate({ session_id: session_id, "products.product_id": productId }, { $inc: { "products.$.quantity": 1 } })
                        res.redirect('/')
                    } else {
                        await CartModel.updateOne({ session_id: session_id }, { $push: { products: { product_id: productId, quantity: 1, price: productData.price, totalPrice: productData.price } } })
                        res.redirect('/')
                    }

                } else {
                    const cartSave = new CartModel({
                        products: [products],
                        session_id: session_id
                    })
                    await cartSave.save()
                    res.redirect('/')
                }

            } else {
                res.redirect('/');

            }
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addTocartPost
}