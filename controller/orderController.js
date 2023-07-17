const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const CartModel = require('../models/cartModel');
const AddressModel = require('../models/addressModel');
const OrderModel = require('../models/orderModel');
var mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const { log } = require('console');


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

                const addressDb = await AddressModel.find({ userId: userId })
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
       
            const addressSave = new AddressModel({
                userId: req.session.userId,
                userName: req.body.name,
                mobile: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.zip
            })
            await addressSave.save()

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
        data = {
            user: req.session.user,
            count: req.cartCount,
            address: address
        }
        res.render('users/editAddress', data)
    } catch (error) {
        console.log(error);
    }
}
const editAddressPost = async (req, res) => {
    try {
        let addressId = req.query.id
        await AddressModel.findOneAndUpdate({ userId: req.session.userId, _id: addressId },
            {
                $set:
                {
                    userName: req.body.name,
                    mobile: req.body.phone,
                    email: req.body.email,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    pincode: req.body.zip
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
                    console.log(req.body.addressId + "-------adressId");
                    const orderSave = new OrderModel({
                        products: cartData.products,
                        user_id: userId,
                        address_id: req.body.addressId,
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
                    let saved = await orderSave.save().then(async (response) => {
                        var ss = response._id
                        if (selectedPayment == 'COD') {
                            const orderId = response._id;
                            await OrderModel.updateOne({ user_id: userId, _id: orderId }, { $set: { status: 'success', orderstatus: 'confirm', paymentStatus: 'pending' } }).then(() => {
                            }).then((status) => {

                            }).then(async () => {
                                for (let i = 0; i < cartOrders.length; i++) {
                                    const productId = cartOrders[i].product_id;
                                    const productQty = cartOrders[i].quantity;
                                    const productActQty = await ProductModel.findOne({ _id: productId });

                                    if (productActQty.stockQuantity >= 1 || productActQty.status) {
                                        console.log(productQty);
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
                        }
                    })
                    await CartModel.deleteOne({ user_id: userId });
                    const orderData = await OrderModel.findOne({ user_id: userId }).sort({ orderDate: -1 }).populate('products.product_id');
                    const addressId = orderData.address_id;
                    console.log(addressId+'=========')

                    let address = await AddressModel.findOne(
                        { userId: req.session.userId ,
                            _id:addressId
                        }
                    );
                    console.log(address)
                    res.status(200).json({ success: true, redirectUrl: '/myOrder', orderData, addressData:address });
                }
            }
        }

        //   res.status(200).json({ success: true, redirectUrl: '/' });

    } catch (error) {
        console.log(error);
    }
}
const myOrders = async (req, res) => {
    try {
        let userId = req.session.userId
        const orderData = await OrderModel.find({ user_id: userId }).sort({ orderDate: -1 }).populate('products.product_id').populate('address_id');
        console.log(orderData);
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
const cancelOrder =async (req,res)=>{
    try {
        let id=req.query.id
        console.log(id);
        const orderUpdate = await OrderModel.findByIdAndUpdate(id, {
            orderstatus:'canceled'
        })
        if(orderUpdate){
            res.status(200).json({ success: true, message: 'order canceled'});
        }
    } catch (error) {
        console.log(error);
    }
}
// -------------------------------- admin ------------------
const loadOrdersAdmin = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
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
    cancelOrder
}