require('dotenv').config()
const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const CartModel = require('../models/cartModel');
const AddressModel = require('../models/addressModel');
const OrderModel = require('../models/orderModel');
const CouponModel = require('../models/couponModel');

var mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const { log } = require('console');
const orderModel = require('../models/orderModel');
const instance = require('../config/paymentGateway')

const RAZORKEY = process.env.RAZORKEY


const checkoutLoad = async (req, res) => {
    try {
        if (req.session.userLogedIn) {
            let userId = req.session.userId
            const userData = await UserModel.findOne({ _id: userId })
            const cartData = await CartModel.findOne({ user_id: userId }).populate('products.product_id');
            if (cartData) {
                const carts = await CartModel.findOne({ user_id: userId });
                const subTotalPrice = carts ? carts.products.reduce((acc, cur) => acc + cur.totalPrice, 0) : 0;
                const totalQuantity = carts ? carts.products.reduce((acc, cur) => acc + cur.quantity, 0) : 0;
                const addressDb = await AddressModel.findOne({ userId: userId }).populate('userId')
                // console.log(addressDb.addresses);
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
            userName: req.body.name.trim(),
            mobile: req.body.phone.trim(),
            email: req.body.email.trim(),
            address: req.body.address.trim(),
            city: req.body.city.trim(),
            state: req.body.state.trim(),
            pincode: req.body.pincode.trim()
        }
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
        // res.json({ success: true });
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
            res.render('users/addAdress', {
                user: req.session.user,
                count: req.cartCount,
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
        // res.json({ success: true });

    } catch (error) {
        console.log(error);
    }
}
const deleteAddress = async (req, res) => {
    try {
        let addressId = req.query.id
        await AddressModel.updateOne({ userId: req.session.userId, "addresses._id": addressId }, { $pull: { addresses: { _id: addressId } } }).then((data) => {
        
        })
        let addressNew = await AddressModel.findOne({userId:req.session.userId})
            res.status(200).json({ success: true, message: 'address removed',address: addressNew});
    } catch (error) {
        console.log(error);
    }
}
const checkoutPost = async (req, res) => {
    try {
        let { addressId, selectedPayment, subTotalPrice, discountPrice, totalamount, code } = req.body
        let userId = req.session.userId
        const cartData = await CartModel.findOne({ user_id: req.session.userId }).populate('products.product_id');

        const outOfStock = cartData.products.reduce((result, p) => {
            if (p.quantity <= p.product_id.stockQuantity) {
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
                const deliveryAddress=await AddressModel.findOne({userId:userId,'addresses._id':addressId})
                const cartOrders = cartData.products;
                // let subTotalPrice = cartData ? cartData.products.reduce((acc, cur) => acc + cur.totalPrice, 0) : 0;
                let subTotal = parseInt(subTotalPrice)
                let discount = parseInt(discountPrice)
                let total = parseInt(totalamount)
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
                    const exist = deliveryAddress.addresses.filter((value) => value._id.toString() == addressId)

                    const orderSave = new OrderModel({
                        products: cartData.products,
                        user_id: userId,
                        deliveryAddress: {
                            userName:exist[0].userName,
                            mobile:exist[0].mobile,
                            email:exist[0].email,
                            address:exist[0].address,
                            city:exist[0].city,
                            state:exist[0].state,
                            pincode:exist[0].pincode,
                        },
                        quantity: totalQuantity,
                        subTotalPrice: subTotal,
                        discountPrice: discount,
                        totalPrice: total,
                        orderDate: recentDate,
                        deliveryDate: deliveredDate,
                        paymentMethod: req.body.selectedPayment,
                        userStatus: '',
                        paymentStatus: 'pending',
                        status: selectedPayment === "online" ? "pending" : "confirm",
                    })
                    let saved = await orderSave.save().then(async (response) => {
                        var ss = response._id
                        if (selectedPayment == 'COD' || selectedPayment == 'wallet' ) {
                            const orderId = response._id;
                            await OrderModel.updateOne({ user_id: userId, _id: orderId }, { $set: { status: 'confirm', paymentStatus: 'pending' } }).then(() => {
                            }).then((status) => {

                            }).then(async () => {
                                for (let i = 0; i < cartOrders.length; i++) {
                                    const productId = cartOrders[i].product_id;
                                    const productQty = cartOrders[i].quantity;
                                    const productActQty = await ProductModel.findOne({ _id: productId });

                                    if (productActQty.stockQuantity >= 1 || productActQty.status) {
                                        const updateQty = productActQty.stockQuantity - productQty
                                        await ProductModel.updateOne({ _id: productId }, { $set: { stockQuantity: updateQty } }).then(p => { }).then(async () => {
                                            if (updateQty === 0) {
                                                await ProductModel.updateOne({ _id: productId }, { $set: { status: false } })
                                            } else {
                                                await ProductModel.updateOne({ _id: productId }, { $set: { status: true } })
                                            }
                                        })
                                    }
                                }
                            }).then(async () => {
                                if (req.body.CouponName) {

                                    const couponData = await Coupon.updateOne({ name: req.body.CouponName }, { $set: { status: 'false' } });
                                }
                            })
                            const orderData = await OrderModel.findOne({ user_id: userId }).sort({ orderDate: -1 }).populate('products.product_id');
                            const addressId = orderData.address_id;
                            let address = await AddressModel.findOne(
                                {
                                    userId: req.session.userId,
                                    _id: addressId
                                }
                            );
                            if(selectedPayment == 'wallet'){
                                await OrderModel.updateOne({ user_id: userId, _id: orderId }, { $set: { status: 'confirm', paymentStatus: 'success' } })
                                let amount=orderData.totalPrice
                                console.log(amount);
                                let a=await UserModel.updateOne({ _id: userId }, { $inc: {  wallet: -amount } })

                                console.log(a);
                                
                            }
                            await CartModel.deleteOne({ user_id: userId });
                            res.status(200).json({ success: true, redirectUrl: '/myOrder', orderData, addressData: exist[0] });

                        } else if (selectedPayment == 'online') {
                            const totalAmount = orderSave.totalPrice;
                            var options = {
                                amount: totalAmount * 100,
                                currency: "INR",
                                receipt: "" + ss
                            }
                            instance.orders.create(options, function (err, order) {

                                // res.status(200).json({ success: "online", redirectUrl: '/myOrder', orderSave, addressId:req.body.addressId,code,orderId:ss,order });
                                res.status(200).json({ success: "online", order });
                            });
                        }
                    })
                    // ------ coupon update
                    if (code != '') {
                        await CouponModel.updateOne({ code: code }, { $push: { user: { user_id: req.session.userId } }, $inc: { maxUsers: -1 } })
                    }
                }
            }
        }
        //   res.status(200).json({ success: true, redirectUrl: '/' });

    } catch (error) {
        console.log(error);
    }
}

const verifyPayment = async (req, res) => {
    try {
        const totalPrice = req.body.amount2;
        const total = req.body.amount;
        const wal = totalPrice - total;
        const details = req.body
        console.log(details['payment[razorpay_payment_id]']);
        const crypto = require('crypto');
        let hmac = crypto.createHmac('sha256', RAZORKEY);
        hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
        hmac = hmac.digest('hex');
        if (hmac == details['payment[razorpay_signature]']) {
            await OrderModel.findByIdAndUpdate({ _id: details['order[receipt]'] }, { $set: { status: "confirm", paymentStatus: "success" } });
            await OrderModel.findByIdAndUpdate({ _id: details['order[receipt]'] }, { $set: { paymentId: details['payment[razorpay_order_id]'] } });
            await CartModel.deleteOne({ userName: req.session.user_id });
            const orderData = await OrderModel.findOne({ user_id: req.session.userId }).sort({ orderDate: -1 }).populate('products.product_id');
            res.status(200).json({ success: true, redirectUrl: '/myOrder', orderData, addressData: orderData.deliveryAddress });
        } else {
            await OrderModel.findByIdAndRemove({ _id: details['order[receipt]'] });
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
    }
}

const myOrders = async (req, res) => {
    try {
        let userId = req.session.userId
        const orderData = await OrderModel.find({ user_id: userId }).sort({ orderDate: -1 }).populate('products.product_id');
        data = {
            user: req.session.user,
            count: req.cartCount,
            orderData
        }
        res.render('users/myOrder', data)

    } catch (error) {
        console.log(error);
    }
}

const cancelOrder = async (req, res) => {
    try {
        let id = req.query.id
        orderDetails = await orderModel.find({ _id: id })
        console.log("-------------------------------");
        console.log(orderDetails[0].paymentMethod);
        if(orderDetails[0].paymentMethod=='online'){
            console.log(orderDetails[0].totalPrice);
            await UserModel.updateOne({_id:req.session.userId},{$inc:{wallet:orderDetails[0].totalPrice}})
        }
        orderDetails[0].products.forEach(async (element) => {
            let orderedQnty = element.quantity
            let a = await ProductModel.findByIdAndUpdate(element.product_id, { $inc: { stockQuantity: orderedQnty } })
        });
        const orderUpdate = await OrderModel.findByIdAndUpdate(id, {
            status: 'canceled'
        })
        if (orderUpdate) {
            res.status(200).json({ success: true, message: 'order canceled' });
        }
    } catch (error) {
        console.log(error);
    }
}
// -------------------------------- admin ------------------
const loadOrdersAdmin = async (req, res) => {
    try {
        const orderData = await OrderModel.find().sort({ orderDate: -1 }).populate('products.product_id');
        res.render('admin/OrderDetails', {
            orderData,
            message: '',
            admin: req.session.admin
        })
    } catch (error) {
        console.log(error);
    }
}
const confirmAdmin = async (req, res) => {
    try {
        const orderData = await OrderModel.findByIdAndUpdate({ _id: req.query.id }, { $set: { status: 'confirm' } })
        res.redirect('/admin/OrderDetails')
    } catch (error) {
        console.log(error);
    }
}
const shippingAdmin = async (req, res) => {
    try {
        const orderData = await OrderModel.findByIdAndUpdate({ _id: req.query.id }, { $set: { status: 'shipping' } })
        res.redirect('/admin/OrderDetails')
    } catch (error) {
        console.log(error);
    }
}
const deliveryAdmin = async (req, res) => {
    try {
        const orderData = await OrderModel.findByIdAndUpdate({ _id: req.query.id }, { $set: { status: 'delivered', paymentStatus: 'success' } })
        data = {

        }
        res.redirect('/admin/OrderDetails')
    } catch (error) {
        console.log(error);
    }
}
// ----------------------- coupon --------------------
const applyCouponPost = async (req, res) => {
    try {
        let { code, totalPrice } = req.body
        const couponData = await CouponModel.findOne({ code: code }).populate('user')

        const exist = couponData.user.filter((value) => value.user_id.toString() == req.session.userId)
        if (exist.length == 0) {
            if (couponData && couponData.status) {
                if (couponData.minCartAmount < parseInt(totalPrice)) {
                    if (couponData.maxUsers > 0) {
                        if (couponData.expiryDate - Date.now() > 0) {
                            if (couponData.discountType == "fixedAmount") {
                                let discountAmount = couponData.discountAmount
                                let updatedTotalPrice = totalPrice - discountAmount
                                res.status(200).json({ success: true, message: `Coupon Valid and got ${discountAmount} discount`, updatedTotalPrice, discountAmount });
                            } else if (couponData.discountType == "percentage") {
                                let discountAmount = ((totalPrice / 100) * couponData.discountAmount)
                                let updatedTotalPrice = totalPrice - discountAmount
                                if (updatedTotalPrice < couponData.maxDiscountAmount) {
                                    res.status(200).json({ success: true, message: `Coupon Valid and got ${discountAmount} discount`, updatedTotalPrice, discountAmount });
                                } else {
                                    let discountAmount = couponData.maxDiscountAmount
                                    updatedTotalPrice = totalPrice - discountAmount
                                    res.status(200).json({ success: true, message: `Coupon Valid and got ${discountAmount} discount`, updatedTotalPrice, discountAmount });
                                }
                            }
                        } else {
                            res.status(200).json({ success: false, message: `This coupon is expired` });
                        }
                    } else {
                        await CouponModel.updateOne({ code: code }, { status: false })
                        res.status(200).json({ success: false, message: `This coupon is out of stock` });
                    }
                } else {
                    res.status(200).json({ success: false, message: `Only applicable for min amount ${couponData.minCartAmount}` });
                }
            } else {
                res.status(200).json({ success: false, message: 'Invalid coupon' });
            }
        } else {
            res.status(200).json({ success: false, message: 'This coupon is only useable once' });
        }
    } catch (error) {

    }
}
module.exports = {
    checkoutLoad,
    addAdress,
    addAdressPost,
    checkoutPost,
    editAddressGet,
    editAddressPost,
    deleteAddress,
    loadOrdersAdmin,
    myOrders,
    cancelOrder,
    shippingAdmin,
    deliveryAdmin,
    applyCouponPost,
    verifyPayment,
    confirmAdmin
}