

const productBrandAdminGet=(req,res)=>{
    try {
        // res.send('hai')
        res.render('admin/productBrand',{colors:''})
    } catch (error) {
        
    }
}
const addBrandAdminGet=(req,res)=>{
    res.render(`admin/addBrand`,{message:''})
}

module.exports={
    productBrandAdminGet,
    addBrandAdminGet
}