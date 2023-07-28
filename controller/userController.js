const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const OtpModel = require('../models/otpModel');
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');
const otpModel = require('../models/otpModel');
const CartModel = require('../models/cartModel');
const wishlistModel = require('../models/wishlistModel');
// const UpdateCartModel = require('../models/updateCartModel');

const sendEmailChangePassword = async (userId, email) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'nandakumart07@gmail.com',
                pass: process.env.PASS
            }
        })
        const options = {
            from: 'nandakumart07@gmail.com',
            to: email,
            subject: 'Change password',
            html: `please click here to change password http://localhost:3000/changePassword?id=${userId}`
        }
        transporter.sendMail(options, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(`http://localhost:3000/changePassword?id=${userId}`);
                console.log("email has been send to :-", info.response);
            }
        })
    } catch (error) {
        console.log(error);
    }
}
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
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
const creatOtp = async (name, email) => {
    otp = generateOTP()
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'nandakumart07@gmail.com',
            pass: process.env.PASS
        }
    })
    const options = {
        from: 'nandakumart07@gmail.com',
        to: email,
        subject: 'For email verification',
        html: `Dear <strong>${name}</strong>,<br><br>
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
    transporter.sendMail(options, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(otp);
            console.log("email has been send to :-", info.response);
        }
    })
    const otpToSave = new OtpModel({
        email: email,
        otp: otp
    })
    let exist = await otpModel.findOne({ email: email })
    if (exist) {
        await otpModel.updateOne({ email: email }, { $set: { otp: otp } })
    } else {
        let saveOtp = await otpToSave.save();
    }


}
// --------------------------------------
const homeGet = async (req, res) => {
    try {
        let SessionCart = await CartModel.find({})
        SessionCart.forEach(async (element) => {
            if (element.session_id) {
                let diff = Date.now() - element.updatedOn
                if (diff > (5 * 60 * 1000)) {
                    await CartModel.deleteOne({ session_id: element.session_id })
                }
            }
        });
        const productDb = await ProductModel.find({ status: true },).populate("category").sort({ createdOn: -1 }).exec();
        let wishList = []
        if (req.session.userLogedIn) {
            wishList = await wishlistModel.find({ user_id: req.session.userId })
            if (wishList.length != 0) {
                wishList[0].products.forEach(wishList => {
                    productDb.forEach(productDb => {
                        if (wishList.product_id.toString() == productDb._id.toString()) {
                            productDb.wishlist = true
                        }
                    });
                });
            }
        } else {
            wishList = []
        }
        res.render('users/index', {
            product: productDb,
            message: '',
            user: req.session.user,
            sessionId: req.sessionID,
            count: req.cartCount,
            wishList
        })
    } catch (error) {
        console.log(error);
    }
}

const productDetailsGetUser = async (req, res) => {
    try {
        let productId = req.params.id
        let a = "hai"
        const productDb = await ProductModel.findOne({ _id: productId.toString() }).populate("category").exec()
        if (productDb) {
            res.render('users/singeProductDetails', { product: productDb, user: req.session.user, count: req.cartCount })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const userLoginGet = async (req, res) => {
    try {
        user = req.session.user
        if (req.query.message) {
            message = req.query.message
        } else {
            message = ''
        }
        if (!user) {
            const userId = ''
            res.render('users/userLogin', { user: req.session.user, count: req.cartCount, userId })
        } else {
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
    }
}
const userLoginPost = async (req, res) => {
    try {
        let email = req.body.email
        let password = req.body.password
        let userDb = await UserModel.findOne({ email: email })
        if (userDb) {
            if (userDb.is_verified) {
                const passwordMatch = await bcrypt.compare(password, userDb.password)
                if (passwordMatch) {
                    if (userDb.is_blocked) {
                        const userId = userDb._id
                        res.render('users/userLogin', { message: ' This website has been blocked for you', user: req.session.user, count: req.cartCount, userId })
                    } else {
                        req.session.user = userDb.name
                        req.session.userId = userDb._id
                        req.session.userLogedIn = true
                        const isSessionCart = await CartModel.findOne({ session_id: req.sessionID })
                        if (isSessionCart) {
                            const userCartData = await CartModel.findOne({ user_id: req.session.userId })
                            if (userCartData) {
                                isSessionCart.products.filter(async (sessionValue) => {
                                    let productData = await ProductModel.findOne({ _id: sessionValue.product_id })
                                    const exist = userCartData.products.filter((value) => value.product_id.toString() == sessionValue.product_id)
                                    if (exist.length !== 0) {
                                        if (exist[0].quantity + sessionValue.quantity < productData.stockQuantity) {
                                            await CartModel.findOneAndUpdate({ user_id: req.session.userId, "products.product_id": sessionValue.product_id }, { $inc: { "products.$.quantity": sessionValue.quantity, "products.$.totalPrice": sessionValue.totalPrice } })
                                            // res.redirect('/')
                                        } else {
                                            await CartModel.findOneAndUpdate({ user_id: req.session.userId, "products.product_id": sessionValue.product_id }, { $set: { "products.$.quantity": productData.stockQuantity, "products.$.totalPrice": sessionValue.price * productData.stockQuantity } })
                                        }
                                    } else {
                                        await CartModel.updateOne({ user_id: req.session.userId }, { $push: { products: { product_id: sessionValue.product_id, quantity: sessionValue.quantity, price: sessionValue.price, totalPrice: sessionValue.totalPrice } } })
                                        // res.redirect('/')
                                    }
                                })
                            } else {
                                await CartModel.updateOne({ session_id: req.sessionID }, { $set: { user_id: req.session.userId }, $unset: { session_id: req.sessionID } })
                            }
                            await CartModel.deleteOne({ session_id: req.sessionID })
                        }
                        res.redirect('/')
                    }
                } else {
                    const userId = userDb._id
                    res.render('users/userLogin', { message: ' Password is incorrect', user: req.session.user, count: req.cartCount, userId })
                }
            } else {
                const redirectUrl = '/otpVerificationGet?email=' + encodeURIComponent(email);
                res.redirect(redirectUrl);
            }
        } else {
            const userId = userDb._id
            res.render('users/userLogin', { message: 'invalid user name or password', user: req.session.user, count: req.cartCount })
        }
        // res.render('users/userLogin',{message:''})
    } catch (error) {
        console.log(error);
    }
}
const userSignUpGet = async (req, res) => {
    try {
        res.render('users/userSignUp', { message: 'Please enter an active email', user: req.session.user, count: req.cartCount })
    } catch (error) {
        console.log(error);
    }
}
const userSignupPost = async (req, res) => {
    try {
        let name = req.body.name
        let email = req.body.email
        const spassword = await securePassword(req.body.password);
        const isUser = await UserModel.findOne({ email: email })
        if (isUser) {
            return res.render('users/userSignUp', { message: 'this email is already taken', user: req.session.user, count: req.cartCount })
        } else {
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
            const userSave = await user.save();
            creatOtp(name, email)
            // res.redirect('/otpVerificationGet',{email:email});
            const redirectUrl = '/otpVerificationGet?email=' + encodeURIComponent(email);
            res.redirect(redirectUrl);
        }
    } catch (error) {
        console.log(error);
    }
}

const otpVerificationGet = async (req, res) => {
    try {
        const email = req.query.email;
        res.render('users/otpVerification', { message: '', email: email, user: req.session.user, count: req.cartCount })
    } catch (error) {
        console.log(error);
    }
}
const resendOtpGet = async (req, res) => {
    try {
        const email = req.query.email;
        let exist = await otpModel.findOne({ email: email })
        const name = await UserModel.findOne({ email: email }).name
        if (exist) {
            creatOtp(name, email)
            res.render('users/otpVerification', { message: 'OTP has been resend', email: email, user: req.session.user, count: req.cartCount })
        }
    } catch (error) {
        console.log(error);
    }
}
const forgotPasswordEmail = async (req, res) => {
    try {
        const email = req.body.email;
        let user = await UserModel.findOne({ email: email })
        const id = user._id
        if (user != null) {
            if (user.is_blocked) {
                res.status(200).json({ success: false, message: 'User is blocked' })

            } else {
                req.session.changePasswordId = id
                await sendEmailChangePassword(id, email)
                res.status(200).json({ success: true, message: 'Please check your email' })
                // res.render('users/userLogin', { message: ' This website has been blocked for you', user: req.session.user, count: req.cartCount,userId})
            }
        } else {
            res.status(200).json({ success: false, message: 'User is not found' })
        }
    } catch (error) {
        console.log(error);
    }
}

const changePasswordGet = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);
        const user = await UserModel.findOne({ _id: id })
        console.log(user);
        if (id == user._id) {
            res.render('users/changePassword', {
                message: '',
                count: req.cartCount,
                email: user.email,
                id: id,
                user: ''
            })
        } else {
            res.redirect('404')
        }
    } catch (error) {
        console.log(error);
    }
}
const changePasswordPost = async (req, res) => {
    try {
        const id = req.query.id;
        const spassword = await securePassword(req.body.password);
        const user = await UserModel.findOne({ _id: id })
        if (id == user._id) {
            await UserModel.findByIdAndUpdate(id, {
                password: spassword
            })
            res.redirect('/login')
        } else {
            res.redirect('404')
        }


    } catch (error) {
        console.log(error);
    }
}


const otpVerificationPost = async (req, res) => {
    try {
        let userOtp = ''
        userOtp += req.body.digit1
        userOtp += req.body.digit2
        userOtp += req.body.digit3
        userOtp += req.body.digit4
        let email = req.body.email
        let otpDb = await otpModel.findOne({ email: email })
        if (userOtp == otpDb.otp) {
            let id = otpDb._id
            await UserModel.updateOne({ email: email }, { $set: { is_verified: true } })
            await otpModel.findByIdAndRemove(id)
            const userId = ''
            res.render('users/userLogin', { message: 'your email has been verified sucessfully', user: req.session.user, count: req.cartCount, userId })
        } else {
            res.render('users/otpVerification', { message: 'invalid otp', email: email, user: req.session.user, count: req.cartCount })
        }

    } catch (error) {
        console.log(error);
    }
}

const userLogoutGet = async (req, res) => {
    try {

        req.session.user = ''
        req.session.userLogedIn = false
        req.session.userId = ''
        res.redirect('/')

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    homeGet,
    productDetailsGetUser,
    userLoginGet,
    userLoginPost,
    userSignUpGet,
    userSignupPost,
    otpVerificationPost,
    otpVerificationGet,
    userLogoutGet,
    resendOtpGet,
    forgotPasswordEmail,
    changePasswordGet,
    changePasswordPost
}