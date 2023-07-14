const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const CartModel = require('../models/cartModel');
const AddressModel = require('../models/addressModel');
var mongoose = require('mongoose');

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
        console.log(addressId);
        console.log(selectedPayment);

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
    deleteAddress
}