const Category = require('../models/categoryModel');

const productCategoryAdminGet = async (req, res) => {
    try {
        const category = await Category.find().exec()
        res.render('admin/productCategory', { category: category, message: '', admin: req.session.admin })
    } catch (error) {

    }
}

const addCategoryAdminPost = async (req, res) => {
    try {
        let { categoryName, categoryDescription } = req.body;
        const category = await Category.find().exec()
        if (categoryName.trim() == '' || categoryDescription.trim() == '') {
            return res.render('admin/productCategory', { message: `can't store null value`, status: `danger`, category: category, admin: req.session.admin })
        }
        const isCategory = await Category.findOne({ categoryName: categoryName })
        if (isCategory) {
            res.render('admin/productCategory', { message: `Category ${categoryName} is already exist`, status: `warning`, category: category, admin: req.session.admin })
        } else {
            const categoryUser = new Category({
                categoryName,
                categoryDescription,
                createdOn: Date.now(),
                updatedOn: Date.now()
            });
            const categorySave = await categoryUser.save();
            const category = await Category.find().exec()
            if (categorySave) {
                res.render('admin/productCategory', { message: `Category ${categoryName} is added sucessfully`, status: 'success', category: category, admin: req.session.admin })
                // res.render('admin/productCategory',{category:category,message:''})
            } else {
                res.render('admin/productCategory', { message: `failed to add color`, status: 'danger', admin: req.session.admin })
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const editCategoryAdminGet = async (req, res) => {
    try {
        const catId = req.params.id
        const catData = await Category.findOne({ _id: catId })
        res.render('admin/editCategory', { data: catData, admin: req.session.admin })
    } catch (error) {
        console.log(error);
    }
}

const editCategoryAdminPost = async (req, res) => {
    try {
        let { categoryName, categoryDescription } = req.body;
        const id = req.params.id
        const categoryUpdate = await Category.findByIdAndUpdate(id, {
            categoryName: categoryName,
            categoryDescription: categoryDescription,
            updatedOn: Date.now()
        }).exec();
        const category = await Category.find().exec()
        if (categoryUpdate) {
            res.render('admin/productCategory', { message: `Category ${categoryName} is updated sucessfully`, status: 'success', category: category, admin: req.session.admin })
            // res.render('admin/productCategory',{category:category,message:''})
        } else {
            res.render('admin/productCategory', { message: `failed to add color`, status: 'danger', admin: req.session.admin })
        }

    } catch (error) {
        console.log(error);
    }
}
const unlistCategoryAdminGet = async (req, res) => {
    try {
        const id = req.params.id
        const categoryUpdate = await Category.findByIdAndUpdate(id, {
            status: false,
            updatedOn: Date.now()
        }).exec();
        const category = await Category.find().exec()
        if (categoryUpdate) {
            res.render('admin/productCategory', { message: `unlisted sucessfully`, status: 'success', category: category, admin: req.session.admin })
        } else {
            res.render('admin/productCategory', { message: `failed to add color`, status: 'danger', admin: req.session.admin })
        }

    } catch (error) {
        console.log(error);
    }
}
const listCategoryAdminGet = async (req, res) => {
    try {
        const id = req.params.id
        const categoryUpdate = await Category.findByIdAndUpdate(id, {
            status: true,
            updatedOn: Date.now()
        }).exec();
        const category = await Category.find().exec()
        if (categoryUpdate) {
            res.render('admin/productCategory', { message: `listed sucessfully`, status: 'success', category: category, admin: req.session.admin })
        } else {
            res.render('admin/productCategory', { message: `failed to add color`, status: 'danger', admin: req.session.admin })
        }

    } catch (error) {
        console.log(error);
    }
}

const deleteCategoryAdminGet = async (req, res) => {
    try {
        const id = req.query.id
        const categoryUpdate = await Category.findByIdAndRemove(id).exec();
        req.session.message = {
            type: 'info',
            message: 'user deleted successfully'
        }
        const category = await Category.find().exec()
        res.render('admin/productCategory', { category: category, message: 'deleted successfully', status: 'danger', admin: req.session.admin })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    productCategoryAdminGet,
    addCategoryAdminPost,
    editCategoryAdminGet,
    editCategoryAdminPost,
    deleteCategoryAdminGet,
    unlistCategoryAdminGet,
    listCategoryAdminGet
}