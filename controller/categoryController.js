const Color = require('../models/categoryModel');

const productCategoryAdminGet=(req,res)=>{
    try {
        // res.send('hai')
        res.render('admin/productCategory',{colors:''})
    } catch (error) {
        
    }
}
// const addCategoryAdminGet=(req,res)=>{
//     res.render(`admin/addBrand`,{message:''})
// }

module.exports={
    productCategoryAdminGet,
    // addBrandAdminGet
}