const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');


const walletSchema = new mongoose.Schema({
    user_id:{
        type:ObjectId,
        require:true,
        ref:'user'
    },
    amount:{
        type:Number,
        default:0
    },
})


module.exports = mongoose.model('Wallet',walletSchema);