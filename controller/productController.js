const productDetailsAdminGet=async (req,res)=>{
    try {
        res.render('admin/productDetails',{ color: ['blue','green','yellow','orange','red'] })
    } catch (error) {
        console.log(error);
    }
}
const addProductAdminGet=async (req,res)=>{
    try {
        res.render('admin/addProduct')
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    productDetailsAdminGet,
    addProductAdminGet
}