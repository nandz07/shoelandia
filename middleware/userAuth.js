
const UserModel = require('../models/userModel');

const verify_user = async (req, res, next) => {
    try {

        if (req.session.userId) {
            let user = await UserModel.findOne({ _id: req.session.userId })
            console.log(user);
            console.log(user.is_blocked);
            if (!user.is_blocked) {
                next()
            } else {
                req.session.user = ''
                req.session.userLogedIn = false
                req.session.userId = ''
                res.redirect('/')
            }
        } else {
            res.redirect('/')

        }

    } catch (error) {
        console.log(error.message);
    }
}

const logout_user = (req, res, next) => {
    try {
        if (req.session.userId) {
            res.redirect('/');
        } else {
            next()
        }

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    verify_user,
    logout_user
}