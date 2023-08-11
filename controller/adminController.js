const UserModel = require('../models/userModel');
const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');
const dashboardHelper = require('../helper/dashboardHelpers');
const bcrypt = require('bcrypt');

const dashboardAdminGet = async (req, res) => {
    try {
        const today=new Date()
        today.setHours(0,0,0,0)
        const yesterday=new Date()
        yesterday.setDate(today.getDate() - 1);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const currentMonthStartDate = new Date(currentYear,currentMonth,1,0,0,0);
        const previousMonthStartDate = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0);
        const previousMonthEndDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

        const promises = [
            dashboardHelper.currentMonthRevenue(currentMonthStartDate,now),
            dashboardHelper.previousMonthRevenue(previousMonthStartDate,previousMonthEndDate),
            dashboardHelper.paymentMethodAmount(),
            dashboardHelper.todayIncome(today,now),
            dashboardHelper.yesterdayIncome(today,yesterday),
            dashboardHelper.totalRevenue(),
            OrderModel.find({status:"confirm"}).count(),
            OrderModel.find({status:"delivered"}).count(),
            UserModel.find({is_blocked:false,is_verified:true}).count(),
            ProductModel.find({status:true}).count(),
            dashboardHelper.dailyChart(),
            dashboardHelper.categorySales()
        ]
        const results = await Promise.all(promises);

        const revenueCurrentMonth = results[0]
        const revenuePreviousMonth = results[1]
        const paymentMethodAmount = results[2]
        const todayIncome = results[3]
        const yesterdayIncome = results[4]
        const totalRevenue = results[5]
        const ordersToShip = results[6]
        const completedOrders = results[7]
        const userCount = results[8]
        const productCount = results[9]
        const dailyChart = results[10]
        const categorySales = results[11]
       
        // const onlinePayment = paymentMethodAmount.find(payment => payment._id === 'online');
        // const walletPayment = paymentMethodAmount.find(payment => payment._id === 'wallet');
        // const onlineAmount = onlinePayment ? onlinePayment.amount : 0;
        // const walletAmount = walletPayment ? walletPayment.amount : 0;

        // const combinedAmount = onlineAmount + walletAmount;
        // const razorPayAmount = combinedAmount.toString();
        const razorPayAmount = paymentMethodAmount && paymentMethodAmount.length > 0 ? paymentMethodAmount.find(payment => payment._id === 'online')?.amount.toString() : 0;
        const walletPayAmount = paymentMethodAmount && paymentMethodAmount.length > 0 ? paymentMethodAmount.find(payment => payment._id === 'wallet')?.amount.toString() : 0;
        const codPayAmount = paymentMethodAmount && paymentMethodAmount.length > 0 ? paymentMethodAmount.find(payment => payment._id === 'COD')?.amount.toString() : 0;
        
    
        const monthlyGrowth = revenuePreviousMonth === 0 ? 100 : (((revenueCurrentMonth - revenuePreviousMonth)/revenuePreviousMonth)*100).toFixed(1);
    
        const dailyGrowth = (((todayIncome - yesterdayIncome)/yesterdayIncome)*100).toFixed(1);
        
        res.render('admin/dashBoard', { 
            admin: req.session.admin ,
            todayIncome,
            dailyGrowth,
            totalRevenue,
            revenueCurrentMonth,
            monthlyGrowth,
            walletPayAmount,
            razorPayAmount,
            codPayAmount,
            userCount,
            ordersToShip,
            completedOrders,
            productCount,
            dailyChart,
            categorySales
        })
        
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