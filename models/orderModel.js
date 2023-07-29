
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');

const productSchema = new mongoose.Schema({
    product_id:{
        type:ObjectId,
        ref:'product'
    },
    quantity:{
       type : Number
    },
    price:{
        type:Number
    },
    totalPrice:{
        type:Number
    },
})

const orderSchema = new mongoose.Schema({
        products: [productSchema],
        user_id: {
            type: ObjectId,
            ref: 'user'
        },
        deliveryAddress: {
            userName:{
                type:String
            },
            mobile:{
                type:Number
            },
            email:{
                type:String
            },
            address:{
                type:String
            },
            city:{
                type:String
            },
            state:{
                type:String
            },
            pincode:{
                type:Number
            }
        },
        quantity: {
            type: Number,
        },
        subTotalPrice: {
            type: Number,
        },
        discountPrice: {
            type: Number,
        },
        totalPrice: {
            type: Number,
        },
        orderDate: {
            type: Date,
        },
        deliveryDate: {
            type: Date,
        },
        paymentMethod: {
            type: String,
        },
        paymentStatus: {
            type: String,
        },
        status:{
            type:String,
        },
        paymentId:{
            type:String,
        },
    });
    
    module.exports = mongoose.model('Order', orderSchema);