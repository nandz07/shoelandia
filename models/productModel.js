const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const addProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    category: {
        type:ObjectId,
        ref:"Category",
        required:true
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: true
    },
    list: {
        type: String,
        default: true
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

const addProductModel = mongoose.model('product', addProductSchema);
module.exports = addProductModel