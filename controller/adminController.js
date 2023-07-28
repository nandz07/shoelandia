const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const dashboardAdminGet = async (req, res) => {
    try {
        res.render('admin/dashBoard', { admin: req.session.admin })
    } catch (error) {
        console.log(error);
    }
}

const bannerAdminGet = async (req, res) => {
    try {
        res.render('admin/banner', { admin: req.session.admin })
    } catch (error) {
        console.log(error);
    }
}

const adminLoginGet = async (req, res) => {
    try {
        admin = req.session.admin
        if (!admin) {
            res.render('admin/loginAdmin', { message: '', admin: req.session.admin })
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error);
    }
}

const adminLoginPost = async (req, res) => {
    try {
        let email = req.body.email
        let password = req.body.password
        let userDb = await UserModel.findOne({ email: email })
        if (userDb) {
            if (userDb.is_admin) {
                const passwordMatch = await bcrypt.compare(password, userDb.password)
                if (passwordMatch) {
                    req.session.admin = email
                    req.session.adminLogedIn = true
                    res.redirect('/admin')
                } else {
                    res.render('admin/loginAdmin', { message: 'Your password is incorrect', admin: req.session.admin })
                }
            } else {
                res.render('admin/loginAdmin', { message: 'Admin can only login', admin: req.session.admin })
            }
        } else {
            res.render('admin/loginAdmin', { message: 'invalid email or password ', admin: req.session.admin })
        }
    } catch (error) {
        console.log(error);
    }
}

const adminLogoutGet = async (req, res) => {
    try {
        req.session.admin = ''
        req.session.adminLogedIn = false
        res.redirect('/admin')

    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    dashboardAdminGet,
    bannerAdminGet,
    adminLoginGet,
    adminLoginPost,
    adminLogoutGet
}