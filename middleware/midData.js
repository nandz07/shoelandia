const CartModel = require('../models/cartModel');

const midData =async (req,res,next)=>{
    try {
        if(req.session.userLogedIn){
            var cartData = await CartModel.findOne({ user_id: req.session.userId })
        }else{
            var cartData = await CartModel.findOne({ session_id: req.sessionID })
        }
            req.cartCount=cartData ? cartData.products.reduce((acc, cur)=>acc + cur.quantity , 0) : 0;
        next()
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    midData
}