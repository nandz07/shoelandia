const ProductModel = require('../models/productModel');
const CartModel = require('../models/cartModel');


const addTocartPost = async (req, res) => {
    try {
        const productId = req.query.id
        if (req.session.userLogedIn) {
            const userId = req.session.userId
            const cartData = await CartModel.findOne({ user_id: userId })
            const productData = await ProductModel.findOne({ _id: productId })
            if (productData.stockQuantity > 0) {


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
                            if (exist[0].quantity < productData.stockQuantity) {

                                await CartModel.findOneAndUpdate({ user_id: userId, "products.product_id": productId }, { $inc: { "products.$.quantity": 1, "products.$.totalPrice": productData.price }, $set: { updatedOn: Date.now() } })

                                res.status(200).json({ success: true, message: 'Product added to cart' });
                            } else {
                                res.status(200).json({ success: false, message: 'Reached the limit' });
                            }
                        } else {
                            await CartModel.updateOne({ user_id: userId }, { $push: { products: { product_id: productId, quantity: 1, price: productData.price, totalPrice: productData.price } }, $set: { updatedOn: Date.now() } })

                            res.status(200).json({ success: true, message: 'Product added to cart' });
                        }


                    } else {
                        const cartSave = new CartModel({
                            products: [products],
                            user_id: userId,
                        })
                        await cartSave.save()
                        res.status(200).json({ success: true, message: 'Product added to cart' });
                    }

                } else {
                    res.redirect('/');

                }
            } else {
                res.status(200).json({ success: false, message: 'Product Not available' });
            }
        } else {
            const session_id = req.sessionID
            const cartData = await CartModel.findOne({ session_id: session_id })
            const productData = await ProductModel.findOne({ _id: productId })

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
                        if (exist[0].quantity < productData.stockQuantity) {

                            await CartModel.findOneAndUpdate({ session_id: session_id, "products.product_id": productId }, { $inc: { "products.$.quantity": 1, "products.$.totalPrice": productData.price }, $set: { updatedOn: Date.now() } })

                            res.status(200).json({ success: true, message: 'Product added to cart' });
                        } else {
                            res.status(200).json({ success: false, message: 'Reached the limit' });
                        }
                    } else {
                        await CartModel.updateOne({ session_id: session_id }, { $push: { products: { product_id: productId, quantity: 1, price: productData.price, totalPrice: productData.price } }, $set: { updatedOn: Date.now() } })

                        res.status(200).json({ success: true, message: 'Product added to cart' });
                    }


                } else {
                    const cartSave = new CartModel({
                        products: [products],
                        session_id: session_id,
                    })
                    await cartSave.save()
                    res.status(200).json({ success: true, message: 'Product added to cart' });
                }

            } else {
                res.redirect('/');

            }
        }

    } catch (error) {
        console.log(error);
    }
}

const userCartGet = async (req, res) => {
    try {

        const user = req.session.userLogedIn;
        const userId = req.session.userId;
        if (user) {
            const cartData = await CartModel.findOne({ user_id: userId }).populate('products.product_id');
            if (cartData) {
                const carts = await CartModel.findOne({ user_id: userId });
                const subTotalPrice = carts ? carts.products.reduce((acc, cur) => acc + cur.totalPrice, 0) : 0;
                const totalQuantity = carts ? carts.products.reduce((acc, cur) => acc + cur.quantity, 0) : 0;
                res.render('users/cart', { cartData, user, subTotalPrice, totalQuantity, count: req.cartCount });
            } else {
                res.render('users/cart', { cartData: '', user, subTotalPrice: '', totalQuantity: '', count: req.cartCount });
            }
        } else {
            const cartData = await CartModel.findOne({ session_id: req.sessionID }).populate('products.product_id');
            if (cartData) {
                const carts = await CartModel.findOne({ session_id: req.sessionID });
                const subTotalPrice = carts ? carts.products.reduce((acc, cur) => acc + cur.totalPrice, 0) : 0;
                const totalQuantity = carts ? carts.products.reduce((acc, cur) => acc + cur.quantity, 0) : 0;
                res.render('users/cart', { cartData, user, subTotalPrice, totalQuantity, count: req.cartCount });
            } else {
                res.render('users/cart', { cartData: '', user, subTotalPrice: '', totalQuantity: '', count: req.cartCount });
            }
        }

    } catch (error) {
        console.log(error);
    }
}

const incrementQty = async (req, res, next) => {
    try {
        const user = req.session.userLogedIn;


        const { id, proId, price, i, qty } = req.body;
        const productId = req.query.id
        if (i === 1) {
            if (req.session.userLogedIn) {
                const userId = req.session.userId
                const cartData = await CartModel.findOne({ user_id: userId })
                const productData = await ProductModel.findOne({ _id: productId })
                if (productData.stockQuantity > 0) {

                    if (productData.status) {
                        if (cartData) {
                            const exist = cartData.products.filter((value) => value.product_id.toString() == productId)
                            if (exist.length !== 0) {
                                if (exist[0].quantity < productData.stockQuantity) {
                                    await CartModel.findOneAndUpdate({ user_id: userId, "products.product_id": productId }, { $inc: { "products.$.quantity": 1, "products.$.totalPrice": productData.price }, $set: { updatedOn: Date.now() } })
                                    let priceOfOne = productData.price
                                    res.status(200).json({ success: true, message: 'Product added to cart', priceOfOne });
                                } else {
                                    res.status(200).json({ success: false, message: 'Reached the limit' });
                                }
                            }
                        }

                    } else {
                        res.redirect('/');

                    }
                } else {
                    res.status(200).json({ success: false, message: 'Product Not available' });
                }
            } else {
                const session_id = req.sessionID
                const cartData = await CartModel.findOne({ session_id: session_id })
                const productData = await ProductModel.findOne({ _id: productId })
                if (productData.status) {
                    if (cartData) {
                        const exist = cartData.products.filter((value) => value.product_id.toString() == productId)
                        if (exist[0].quantity < productData.stockQuantity) {
                            if (exist.length !== 0) {
                                await CartModel.findOneAndUpdate({ session_id: session_id, "products.product_id": productId }, { $inc: { "products.$.quantity": 1, "products.$.totalPrice": productData.price }, $set: { updatedOn: Date.now() } })
                                let priceOfOne = productData.price
                                res.status(200).json({ success: true, message: 'Product added to cart', priceOfOne });
                            }
                        } else {
                            res.status(200).json({ success: false, message: 'Reached the limit' });
                        }

                    }
                } else {
                    res.redirect('/');

                }
            }

        } else if (i === -1) {
            if (req.session.userLogedIn) {
                const userId = req.session.userId
                const cartData = await CartModel.findOne({ user_id: userId })
                const productData = await ProductModel.findOne({ _id: productId })
                if (productData.stockQuantity > 0) {

                    if (productData.status) {
                        if (cartData) {
                            const exist = cartData.products.filter((value) => value.product_id.toString() == productId)
                            if (exist[0].quantity > 1) {
                                await CartModel.findOneAndUpdate({ user_id: userId, "products.product_id": productId }, { $inc: { "products.$.quantity": -1, "products.$.totalPrice": -productData.price }, $set: { updatedOn: Date.now() } })
                                let priceOfOne = productData.price
                                res.status(200).json({ success: true, message: 'Product reduced to cart', priceOfOne });
                            } else {
                                res.status(200).json({ success: false, message: 'min 1 product' });
                            }
                        }

                    } else {
                        res.redirect('/');

                    }
                } else if (productData.stockQuantity == 0) {
                    await CartModel.updateOne({ user_id: userId, "products._id": productId }, { $pull: { products: { _id: productId } } }).then((data) => {
                        res.redirect('/cart')
                    })
                    // res.status(200).json({ success: false, message: 'Product Not available' });
                }
            } else {
                const session_id = req.sessionID
                const cartData = await CartModel.findOne({ session_id: session_id })
                const productData = await ProductModel.findOne({ _id: productId })

                if (productData.status) {
                    if (cartData) {
                        const exist = cartData.products.filter((value) => value.product_id.toString() == productId)
                        if (exist[0].quantity > 1) {
                            await CartModel.findOneAndUpdate({ session_id: session_id, "products.product_id": productId }, { $inc: { "products.$.quantity": -1, "products.$.totalPrice": -productData.price }, $set: { updatedOn: Date.now() } })
                            let priceOfOne = productData.price
                            res.status(200).json({ success: true, message: 'Product added to cart', priceOfOne });
                        } else {
                            res.status(200).json({ success: false, message: 'min 1 product' });
                        }
                    }
                } else if (productData.stockQuantity == 0) {

                    res.redirect('/cart')

                }
            }
        }

    } catch (error) {
        console.log(error);
    }
}
const removeCart = async (req, res) => {
    try {
        const user = req.session.userLogedIn;
        const proId = req.query.id;
        const userId = req.session.userId
        console.log(userId);
        if (user) {
            const productData = await CartModel.findOne({ user_id: userId })
            if (productData) {
                const product = productData.products.find((p) => p.product_id.toString() === proId)
                await CartModel.updateOne({ user_id: userId, "products.product_id": proId }, { $pull: { products: { product_id: proId } } }).then((data) => {
                    // res.redirect('/cart')
                    res.status(200).json({ success: true, message: 'Product removed' });

                })

            }

        } else {
            const productData = await CartModel.findOne({ session_id: req.sessionID })
            if (productData) {
                const product = productData.products.find((p) => p.product_id.toString() === proId)
                await CartModel.updateOne({ session_id: req.sessionID, "products.product_id": proId }, { $pull: { products: { product_id: proId } } }).then((data) => {
                    // res.redirect('/cart')
                    res.status(200).json({ success: true, message: 'Product removed' });

                })

            }
        }

    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    addTocartPost,
    userCartGet,
    incrementQty,
    removeCart
}