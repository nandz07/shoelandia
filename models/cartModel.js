const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: {
    type: ObjectId,
    ref: 'product'
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
});

const cartSchema = new mongoose.Schema({
  products: [productSchema],
  session_id: {
    type: String, 
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user' 
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
});

module.exports = mongoose.model('cart', cartSchema);
