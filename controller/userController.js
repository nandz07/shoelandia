const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const OtpModel = require('../models/otpModel');
const nodemailer=require('nodemailer')
const bcrypt = require('bcrypt');
const otpModel = require('../models/otpModel');
const userModel = require('../models/userModel');


const securePassword = async (password)=>{
    try{
        const passwordHash = await bcrypt.hash(password,10);
    return passwordHash;
    }catch(error){
        console.log(error.message);
    }
}
function generateOTP() {
    var min = 1000;
    var max = 9999;
    var otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp;
  }
  let otp 
const creatOtp=async(name,email)=>{
     otp=generateOTP()
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user:'nandakumart07@gmail.com',
            pass:process.env.PASS
        }
    })
    const options = {
        from:'nandakumart07@gmail.com',
        to:email,
        subject:'For email verification',
        html:`Dear <strong>${name}</strong>,<br><br>
        Thank you for choosing ! To complete your registration/account setup, we require you to verify your email address using the provided OTP.<br><br>
        Please find below your One-Time Password (OTP) and enter it on the verification page:http://localhost:3000/userSignupPost<br><br>
        OTP: <h3>${otp}</h3><br><br>
        Please note that this OTP is only valid for a limited time period and can only be used once. If you haven't initiated this request, please ignore this email.<br><br>
        If you have any questions or need assistance, please don't hesitate to reach out to our support team at nandakumart07@gmail.com.<br><br>
        Thank you for using <h3>S H O E L A N D I A !</h3><br><br>
        Best regards,<br>
        <strong>Nandakumar T (CEO)</strong>
        `
    }
    transporter.sendMail(options,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log(otp);
            console.log("email has been send to :-",info.response);
        }
    })
    const otpToSave=new OtpModel({
        email:email,
        otp:otp
    })
    let saveOtp=await otpToSave.save();
}
// --------------------------------------
const homeGet=async (req,res)=>{
    try {
        const productDb = await ProductModel.find({ status: true },).sort({createdOn:-1}).exec();
        res.render('users/index',{ product: productDb, message: '' ,user:req.session.user})
    } catch (error) {
        console.log(error);
    }
}

const productDetailsGetUser=async(req,res)=>{
    try {
        let id=req.params.id
        const productDb= await ProductModel.findOne({_id:id})
        if(productDb){
            res.render('users/singeProductDetails',{product:productDb,user:req.session.user})
        }
    } catch (error) {
        console.log(error);
    }
}

const userLoginGet=async (req,res)=>{
    try {
        user=req.session.user
        if(!user){
        res.render('users/userLogin',{message:'',user:req.session.user})
        }else{
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
    }
}
const userLoginPost=async (req,res)=>{
    try {
        let email=req.body.email
        let password=req.body.password
        let userDb=await userModel.findOne({email:email})
        if(userDb){
        if(userDb.is_verified){
            const passwordMatch = await bcrypt.compare(password,userDb.password)
            if(passwordMatch){
                if(userDb.is_blocked){
                    res.render('users/userLogin',{message:' This website has been blocked for you',user:req.session.user})
                }else{
                req.session.user = userDb.name
                req.session.userLogedIn = true
                res.redirect('/')
                }
            }else{
                res.render('users/userLogin',{message:' Password is incorrect',user:req.session.user})
            }
        }else{
            const redirectUrl = '/otpVerificationGet?email=' + encodeURIComponent(email);
            res.redirect(redirectUrl);
        }
    }else{
        res.render('users/userLogin',{message:'invalid user name or password',user:req.session.user})
    }
        // res.render('users/userLogin',{message:''})
    } catch (error) {
        console.log(error);
    }
}
const userSignUpGet=async (req,res)=>{
    try {
        res.render('users/userSignUp',{message:'Please enter an active email',user:req.session.user})
    } catch (error) {
        console.log(error);
    }
}
const userSignupPost=async (req,res)=>{
    try {
        let name=req.body.name
        let email=req.body.email
        const spassword = await securePassword(req.body.password);
        const isUser=await UserModel.findOne({email:email})
        if(isUser){
           return res.render('users/userSignUp',{message:'this email is already taken',user:req.session.user})
        }else{
        const user = new UserModel({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: spassword,
            is_admin: false,
            is_verified: false,
            createdOn: Date.now(),
            updatedOn: Date.now()
        })
        const userSave=await user.save();
        creatOtp(name,email)
        // res.redirect('/otpVerificationGet',{email:email});
        const redirectUrl = '/otpVerificationGet?email=' + encodeURIComponent(email);
        res.redirect(redirectUrl);
    }
    } catch (error) {
        console.log(error);
    }
}

const otpVerificationGet=async (req,res)=>{
    try {
        const email = req.query.email;
        res.render('users/otpVerification',{message:'',email:email,user:req.session.user})
    } catch (error) {
        console.log(error);
    }
}
const otpVerificationPost=async (req,res)=>{
    try {
        let userOtp=''
        userOtp+=req.body.digit1
        userOtp+=req.body.digit2
        userOtp+=req.body.digit3
        userOtp+=req.body.digit4
        let email=req.body.email
        let otpDb=await otpModel.findOne({ email: email })
        if(userOtp == otpDb.otp){
            let id=otpDb._id
            await userModel.updateOne({email:email},{$set:{is_verified:true}})
            await otpModel.findByIdAndRemove(id)
            res.render('users/userLogin',{message:'your email has been verified sucessfully',user:req.session.user})
        }else{
            res.render('users/otpVerification',{message:'invalid otp',email:email,user:req.session.user})
        }

    } catch (error) {
        console.log(error);
    }
}

const userLogoutGet = async (req, res) => {
    try {

                req.session.user = ''
                req.session.userLogedIn = false
                res.redirect('/')
            
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    homeGet,
    productDetailsGetUser,
    userLoginGet,
    userLoginPost,
    userSignUpGet,
    userSignupPost,
    otpVerificationPost,
    otpVerificationGet,
    userLogoutGet
}