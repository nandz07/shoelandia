const ProductModel = require('../models/productModel');
const homeGet=async (req,res)=>{
    try {
        let productDb = await ProductModel.find().exec()
        console.log(productDb);
        res.render('users/index',{ product: productDb, message: '' })
    } catch (error) {
        console.log(error);
    }
}

const productDetailsGetAdmin=async(req,res)=>{
    try {
        console.log('hai');
        let id=req.params.id
        const productDb= await ProductModel.findOne({_id:id})
        if(productDb){
            res.render('users/singeProductDetails',{product:productDb})
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports={
    homeGet,
    productDetailsGetAdmin
}