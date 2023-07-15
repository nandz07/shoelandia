
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
            ref: 'User'
        },
        address_id: {
            type: ObjectId,
            ref: 'Address'
        },
        quantity: {
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
        orderstatus:{
            type:String,
        },
        status:{
            type:String,
        },
    });
    
    module.exports = mongoose.model('Order', orderSchema);