const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');

const otpModel = require('../models/otpModel');
const userModel = require('../models/userModel');



const addTocartPost = async (password)=>{
    try {
        let userLogedIn=req.session.userLogedIn
        if(userLogedIn){

        }
        else{
            const redirectUrl = '/otpVerificationGet?message=' + encodeURIComponent('Need to login');
            res.redirect(redirectUrl);
        }
    } catch (error) {
        
    }
}

module.exports={
    addTocartPost
}