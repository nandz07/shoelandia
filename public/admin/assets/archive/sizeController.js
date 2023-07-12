const SizeModel = require('../models/sizeModel');

const productSizeAdminGet = async (req, res) => {
    try {
        const size = await SizeModel.find().exec()
        res.render('admin/productSize', { size: size, message: '' })
    } catch (error) {
        console.log(error);
    }
}
const addSizeAdminGet = async (req, res) => {
    try {
        // const Size=await Size.find().exec()
        res.render('admin/addProductSize', { size: '', message: '' })
    } catch (error) {
        console.log(error);
    }
}

const addSizeAdminPost = async (req, res) => {
    try {
        let productSize = req.body.newSize;
        const size = await SizeModel.find().exec()
        if (productSize.trim() == '') {
            return res.render('admin/productSize', { message: `can't store null value`, status: `danger`, size: size })
        }
        const isSize = await SizeModel.findOne({ productSize: productSize })
        if (isSize) {

            res.render('admin/productSize', { message: `Size ${productSize} is already exist`, status: `warning`, size: Size })
        } else {
            const sizeUser = new SizeModel({
                size: productSize,
                createdOn: Date.now(),
                updatedOn: Date.now()
            });
            const sizeSave = await sizeUser.save();
            const Size = await SizeModel.find().exec()
            if (sizeSave) {
                console.log(sizeSave);
                res.render('admin/productSize', { message: `Size ${productSize} is added sucessfully`, status: 'success', size: Size })
                // res.render('admin/productSize',{Size:Size,message:''})
            } else {
                res.render('admin/productSize', { message: `failed to add color`, status: 'danger' })
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const editProductSizeAdminGet = async (req, res) => {
    try {
        const sizeId = req.params.id
        const sizeData = await SizeModel.findOne({ _id: sizeId })
        console.log(sizeData);
        res.render('admin/editSize', { data: sizeData })
    } catch (error) {
        console.log(error);
    }
}

const editProductSizeAdminPost = async (req, res) => {
    try {
        let productSize = req.body.newSize;
        const id = req.params.id
        const isSize = await SizeModel.findOne({ size: productSize })
        console.log(isSize);
        if (isSize) {
            const size = await SizeModel.find().exec()
            return res.render('admin/productSize', { message: `Size ${productSize} is already exist`, status: `warning`, size: size })
        } else {
            const SizeUpdate = await SizeModel.findByIdAndUpdate(id, {
                size: productSize,
                updatedOn: Date.now()
            }).exec();
            const SizeDb = await SizeModel.find().exec()
            if (SizeUpdate) {
                res.render('admin/productSize', { message: `Size ${productSize} is updated sucessfully`, status: 'success', size: SizeDb })
                // res.render('admin/productSize',{Size:Size,message:''})
            } else {
                res.render('admin/productSize', { message: `failed to add color`, status: 'danger' })
            }
        }
    } catch (error) {
        console.log(error);
    }
}
const unlistSizeAdminGet = async (req, res) => {
    try {
        const id = req.params.id
        const SizeUpdate = await SizeModel.findByIdAndUpdate(id, {
            status: false,
            updatedOn: Date.now()
        }).exec();
        const size = await SizeModel.find().exec()
        if (SizeUpdate) {

            res.render('admin/productSize', { message: `unlisted sucessfully`, status: 'success', size: size })
        } else {
            res.render('admin/productSize', { message: `failed to add color`, status: 'danger' })
        }

    } catch (error) {
        console.log(error);
    }
}
const listSizeAdminGet = async (req, res) => {
    try {
        const id = req.params.id
        const SizeUpdate = await SizeModel.findByIdAndUpdate(id, {
            status: true,
            updatedOn: Date.now()
        }).exec();
        const size = await SizeModel.find().exec()
        if (SizeUpdate) {
            res.render('admin/productSize', { message: `listed sucessfully`, status: 'success', size: size })
        } else {
            res.render('admin/productSize', { message: `failed to add color`, status: 'danger' })
        }

    } catch (error) {
        console.log(error);
    }
}

// const deleteSizeAdminGet = async (req, res) => {
//     try {
//         const id = req.query.id
//         console.log(id);
//         const SizeUpdate = await Size.findByIdAndRemove(id).exec();
//         req.session.message = {
//             type: 'info',
//             message: 'user deleted successfully'
//         }
//         const Size = await Size.find().exec()
//         res.render('admin/productSize', { Size: Size, message: 'deleted successfully', status: 'danger' })
//     } catch (error) {
//         console.log(error);
//     }
// }

module.exports = {
    productSizeAdminGet,
    addSizeAdminGet,
    addSizeAdminPost,
    editProductSizeAdminGet,
    editProductSizeAdminPost,
    // deleteSizeAdminGet,
    unlistSizeAdminGet,
    listSizeAdminGet
}