const UserModel = require('../models/userModel');

const userDetailsAdminGet = async (req, res) => {
    try {
        let userDb = await UserModel.find({is_admin:false}).exec()
        res.render('admin/userDetails', { user: userDb, message: '',admin:req.session.admin })
    } catch (error) {
        console.log(error);
    }
}

const unlistUserDetailsAdminGet = async (req, res) => {
    try {
        const id = req.params.id
        const userUpList = await UserModel.findByIdAndUpdate(id, {
            is_blocked: true,
            updatedOn: Date.now()
        }).exec();
        let userDb = await UserModel.find({is_admin:false}).exec()
        if (userUpList) {
            res.render('admin/userDetails', { message: `Blocked sucessfully`, status: 'success', user: userDb ,admin:req.session.admin})
        } else {
            res.render('admin/userDetails', { message: `failed to unlist`, status: 'danger', user: userDb ,admin:req.session.admin})
        }
    } catch (error) {
        console.log(error);
    }
}
const listUserDetailsAdminGet = async (req, res) => {
    try {
        const id = req.params.id
        const userUpList = await UserModel.findByIdAndUpdate(id, {
            is_blocked: false,
            updatedOn: Date.now()
        }).exec();
        let userDb = await UserModel.find({is_admin:false}).exec()
        if (userUpList) {
            res.render('admin/userDetails', { message: `activated sucessfully`, status: 'success', user: userDb ,admin:req.session.admin})
        } else {
            res.render('admin/userDetails', { message: `failed to unlisted`, status: 'danger', user: userDb ,admin:req.session.admin})
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    userDetailsAdminGet,
    unlistUserDetailsAdminGet,
    listUserDetailsAdminGet
}