const CouponModel = require('../models/couponModel');

const couponGet= async(req,res)=>{
    try {
        // res.send('hai')
        const coupon=await CouponModel.find().exec()
        res.render('admin/coupon',{coupon:coupon,message:'',admin:req.session.admin})
    } catch (error) {
        
    }
}
const addCouponGet= async(req,res)=>{
    try {
        console.log(req.query.message);
        console.log(req.query.message);
        if(req.query.message){
            
            message=req.query.message
        }else{
            message=''
        }
        const coupon=await CouponModel.find().exec()
        console.log(message);
        res.render('admin/addCoupon',{coupon:coupon,message,admin:req.session.admin})
    } catch (error) {
        
    }
}
const addCouponPost= async(req,res)=>{
    try {
        console.log('hai');
        const { code, discountType, discountAmount, minCartAmount, maxDiscountAmount, maxUsers, expiryDate } = req.body;
        const coupon = new CouponModel({
            code: code,
            discountType: discountType,
            discountAmount: discountAmount,
            minCartAmount: minCartAmount,
            maxDiscountAmount: maxDiscountAmount,
            maxUsers: maxUsers,
            expiryDate: expiryDate,
            createdOn: Date.now(),
            updatedOn: Date.now(),
        });
        const couponData = await coupon.save();
        const redirectUrl = '/admin/coupon?message=' + encodeURIComponent('coupon added successfully');
        res.redirect(redirectUrl);
    } catch (error) {
        
    }
}

 

  
module.exports={
    couponGet,
    addCouponGet,
    addCouponPost
}