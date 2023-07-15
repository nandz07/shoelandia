const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const CartModel = require('../models/cartModel');
const AddressModel = require('../models/addressModel');
const OrderModel = require('../models/orderModel');
var mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path')


const checkoutLoad = async (req, res) => {
    try {
        if (req.session.userLogedIn) {
            let userId = req.session.userId
            console.log(req.session.userId);
            const userData = await UserModel.findOne({ _id: userId })
            console.log(userData);
            const cartData = await CartModel.findOne({ user_id: userId }).populate('products.product_id');
            if (cartData) {

                const carts = await CartModel.findOne({ user_id: userId });
                const subTotalPrice = carts ? carts.products.reduce((acc, cur) => acc + cur.totalPrice, 0) : 0;
                const totalQuantity = carts ? carts.products.reduce((acc, cur) => acc + cur.quantity, 0) : 0;

                const addressDb = await AddressModel.findOne({ userId: userId })
                console.log(addressDb + ' db');
                if (addressDb) {
                    res.render('users/checkOut', {
                        user: req.session.user,
                        count: req.cartCount,
                        cartData,
                        subTotalPrice,
                        totalQuantity,
                        addressDb,
                        userData
                    })
                } else {
                    res.render('users/checkOut_1', {
                        user: req.session.user,
                        count: req.cartCount,
                        cartData,
                        subTotalPrice,
                        totalQuantity,
                        userData
                    })
                }
            }
        } else {
            const redirectUrl = '/login?message=' + encodeURIComponent('Need to login for purchase');
            res.redirect(redirectUrl);
        }
    } catch (error) {
        console.log(error);
    }
}
const addAdressPost = async (req, res) => {
    try {

        const address = {
            userName: req.body.name,
            mobile: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.zip
        }
        console.log(req.session.userId + "userId");
        const addressData = await AddressModel.findOne({ userId: req.session.userId })

        if (addressData) {
            await AddressModel.findOneAndUpdate({ userId: req.session.userId }, { $push: { addresses: address } })
        } else {
            const addressSave = new AddressModel({
                userId: req.session.userId,
                addresses: [address]
            })
            await addressSave.save()
        }
        res.redirect('/checkout')
    } catch (error) {
        console.log(error);
    }
}
const addAdress = async (req, res) => {
    try {
        if (req.session.userLogedIn) {
            let userId = req.session.userId
            const userData = await UserModel.findOne({ _id: userId })
            const addressDb = await AddressModel.find({ user_id: userId.toString() })
            console.log(userData);

            res.render('users/addAdress', {
                user: req.session.user,
                count: req.cartCount,
                addressDb,
                userData
            })

        } else {
            const redirectUrl = '/login?message=' + encodeURIComponent('Need to login for purchase');
            res.redirect(redirectUrl);
        }
    } catch (error) {
        console.log(error);
    }
}

const editAddressGet = async (req, res) => {
    try {
        let addressId = req.query.id

        let address = await AddressModel.findOne(
            { userId: req.session.userId }
        );
        const exist = address.addresses.filter((value) => value._id.toString() == addressId)
        console.log(exist[0]);
        data = {
            user: req.session.user,
            count: req.cartCount,
            address: exist[0]
        }
        res.render('users/editAddress', data)
    } catch (error) {
        console.log(error);
    }
}
const editAddressPost = async (req, res) => {
    try {
        let addressId = req.query.id
        await AddressModel.findOneAndUpdate({ userId: req.session.userId, "addresses._id": addressId },
            {
                $set:
                {
                    "addresses.$.userName": req.body.name,
                    "addresses.$.mobile": req.body.phone,
                    "addresses.$.email": req.body.email,
                    "addresses.$.address": req.body.address,
                    "addresses.$.city": req.body.city,
                    "addresses.$.state": req.body.state,
                    "addresses.$.pincode": req.body.zip
                }
            })
        res.redirect('/checkout')
    } catch (error) {
        console.log(error);
    }
}
const deleteAddress = async (req, res) => {
    try {
        let addressId = req.query.id
        await AddressModel.updateOne({ userId: req.session.userId, "addresses._id": addressId }, { $pull: { addresses: { _id: addressId } } }).then((data) => {
            res.status(200).json({ success: true, message: 'address removed' });
        })
    } catch (error) {
        console.log(error);
    }
}
const checkoutPost = async (req, res) => {
    try {

        let { addressId, selectedPayment } = req.body
        let userId = req.session.userId
        console.log(addressId);
        console.log(selectedPayment);
        const cartData = await CartModel.findOne({ user_id: req.session.userId }).populate('products.product_id');

        const outOfStock = cartData.products.reduce((result, p) => {
            if (p.quantity <= p.product_id.stockQuantity) {
                console.log('-------------------------');
                console.log(p);
                console.log('-------------------------');
                result.filtered.push(p);
            } else {
                result.unfiltered.push(p);
            }
            return result;
        }, { filtered: [], unfiltered: [] });

        const filteredData = outOfStock.filtered;
        const unfilteredData = outOfStock.unfiltered;
        if (unfilteredData.length != 0) {
            res.status(200).json({ success: false, message: 'out of quantity', data: unfilteredData, redirectUrl: '/cart' })
        } else {
            if (cartData) {
                const cartOrders = cartData.products;
                let subTotalPrice = cartData ? cartData.products.reduce((acc, cur) => acc + cur.totalPrice, 0) : 0;
                const totalQuantity = cartData ? cartData.products.reduce((acc, cur) => acc + cur.quantity, 0) : 0;
                //find order date and deliverDate
                var days = 7;
                var newDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
                var recentDate = new Date();
                var deliveredDate = newDate;
                if (req.body.subTotalPrice) {
                    subTotalPrice = req.body.subTotalPrice;
                }

                // create orders in database
                if (cartOrders) {
                    const orderSave = new OrderModel({
                        products: cartData.products,
                        user_id: userId,
                        address_id: req.body.flexRadioDefault,
                        quantity: totalQuantity,
                        totalPrice: subTotalPrice,
                        orderDate: recentDate,
                        deliveryDate: deliveredDate,
                        paymentMethod: req.body.selector,
                        orderStatus: '',
                        userStatus: '',
                        paymentStatus: 'pending',
                        status: 'pending',
                    })
                    await orderSave.save().then(async (response) => {
                        if (selectedPayment == 'COD') {
                            const orderId = response._id;
                            await OrderModel.updateOne({ user_id: userId, _id: orderId }, { $set: { status: 'success', orderstatus: 'confirm', paymentStatus: 'pending' } }).then(() => {
                            }).then((status) => {
                                
                            }).then(async () => {
                                for (let i = 0; i < cartOrders.length; i++) {
                                    const productId = cartOrders[i].product_id;
                                    const productQty = cartOrders[i].quantity;
                                    console.log(" -------------productQty----------------");
                                    console.log(productQty);
                                    console.log(productId);
                                    console.log(" -------------productQty----------------");
                                    const productActQty = await ProductModel.findOne({ _id: productId });
                                    console.log(" ------------ productActQty -----------------");
                                    console.log(productActQty);
                                    console.log(productActQty+" ----------productActQty-------------------");

                                    if (productActQty.stockQuantity >= 1 || productActQty.status) {
                                            console.log(productQty);
                                        const updateQty = productActQty.stockQuantity - productQty
                                        await ProductModel.updateOne({ _id: productId }, { $set: { stockQuantity: updateQty } }).then(p => { }).then(async () => {
                                            if (updateQty === 0) {
                                                await ProductModel.updateOne({ _id: productId }, { $set: { status: false } })
                                            } else {
                                                // await ProductModel.updateOne({ _id: productId }, { $set: { status: 'Available' } })
                                            }
                                        })
                                    }
                                }
                            }).then(async () => {
                                if (req.body.CouponName) {

                                    const couponData = await Coupon.updateOne({ name: req.body.CouponName }, { $set: { status: 'false' } });
                                }
                            })
                        }
                    })
                    await CartModel.deleteOne({ user_id: userId });
                    res.status(200).json({ success: true, redirectUrl: '/' });
                }
            }
        }

        //   res.status(200).json({ success: true, redirectUrl: '/' });

    } catch (error) {
        console.log(error);
    }
}
// const checkoutPost = async (req, res) => {
//     try {
//         // res.status(200).json({ success: true, message: 'address removed' });
//         res.status(200).json({ success: true, redirectUrl: '/' });
//         // const renderedHTML = await ejs.renderFile('/cart', { /* EJS data */ });
//     //     const cartHTML = await ejs.renderFile(path.join(__dirname, 'views', 'cart.ejs'), { /* EJS data */ });
//     // res.status(200).json({ success: true, html: cartHTML  });
//         let { addressId, selectedPayment } = req.body
//         console.log(addressId);
//         console.log(selectedPayment);
//         const cartData = await CartModel.findOne({ user_id: req.session.userId }).populate('products.product_id');

//         const outOfStock = cartData.products.reduce((result, p) => {
//             if (p.quantity <= p.product_id.stockQuantity) {
//                 console.log('-------------------------');
//                 console.log(p);
//                 console.log('-------------------------');
//               result.filtered.push(p);
//             } else {
//               result.unfiltered.push(p);
//             }
//             return result;
//           }, { filtered: [], unfiltered: [] });

//           const filteredData = outOfStock.filtered;
//           const unfilteredData = outOfStock.unfiltered;
//           console.log("filteredData--------------------");
//           console.log(filteredData);
//           console.log("filteredData--------------------");
//           console.log("-----------unfilteredData--------------------");
//           console.log(unfilteredData);
//           console.log("-----------unfilteredData--------------------");
//         // const outofStock = cartData.products.filter(p => p.quantity <= p.product_id.stockQuantity);

//         // console.log("-----------unfilteredData--------------------");
//         // //   console.log(cartData.products[0].quantity);
//         //   console.log(outofStock);
//         //   console.log("-----------unfilteredData--------------------");



//         // console.log(cartData);
//         // let products=new Array
//         // cartData

// // res.redirect('/')
//     } catch (error) {
//         console.log(error);
//     }
// }
module.exports = {
    checkoutLoad,
    addAdress,
    addAdressPost,
    checkoutPost,
    editAddressGet,
    editAddressPost,
    deleteAddress
}