
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Number } = require('twilio/lib/twiml/VoiceResponse');

const productSchema=new mongoose.Schema({
    product_id:{
        type:ObjectId,
        ref:'product'
    }
})

const wishlistSchema=new mongoose.Schema({
    products:[productSchema],
    user_id:{
        type:ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Wishlist', wishlistSchema);

