require('dotenv').config()

const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: 'rzp_test_tFfhFZy4sSrg7r',
    key_secret: process.env.RAZORKEY
  });


module.exports = instance
