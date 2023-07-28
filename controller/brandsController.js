

const productBrandAdminGet = (req, res) => {
    try {
        // res.send('hai')
        res.render('admin/productBrand', { colors: '', admin: req.session.admin })
    } catch (error) {

    }
}
const addBrandAdminGet = (req, res) => {
    res.render(`admin/addBrand`, { message: '', admin: req.session.admin })
}

module.exports = {
    productBrandAdminGet,
    addBrandAdminGet
}