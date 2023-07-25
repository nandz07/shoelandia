const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');


const userSchema=new mongoose.Schema({
    user_id:{
        type:ObjectId,
        ref:'user'
    }
})
const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    discountType:{
        type:String,
        required:true
    },
    discountAmount:{
        type:Number
    },
    minCartAmount:{
        type:Number
    },
    maxDiscountAmount:{
        type:Number
    },
    user:[userSchema],
    maxUsers:{
        type:Number
    },
    status:{
        type:Boolean,
        default:true
    },
    expiryDate:{
        type:Date,
        required:true
    },
    createdOn: {
        type: Date,
        require: true,
        default: Date.now()
    },
    updatedOn: {
        type: Date,
        require: true,
        default: Date.now()
    },
})

const couponModel = mongoose.model("coupon",couponSchema);
module.exports = couponModel;