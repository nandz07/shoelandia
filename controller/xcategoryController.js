const Category = require('../models/categoryModel');

const productCategoryAdminGet= async(req,res)=>{
    try {
        // res.send('hai')
        const category=await Category.find().exec()
        res.render('admin/productCategory',{category:category})
    } catch (error) {
        
    }
}

const addCategoryAdminPost = async (req, res) => {
    let { categoryName, categoryDescription } = req.body;
    console.log(categoryName);
    console.log(categoryDescription);
  
    if (!categoryName) {
      return res.status(400).json({ message: 'Category name is required' });
    }
  
    const isCategory = await Category.findOne({ categoryName });
    console.log(isCategory+"--------------");
    if (isCategory) {
      return res.json({ category: '', message: 'Category already exists', status: 'warning' });
    }
  
    const category = new Category({
      categoryName,
      categoryDescription,
      createdOn: Date.now()
    });
  
    try {
      const categorySave = await category.save();
      console.log(`saved data ${category}`);
            if(categorySave){
              const categoryList=await Category.find().exec()
              let index=categoryList.length

              var data=[
                `${index}`,
                category.categoryName,
                `<a href="#" data-bs-toggle="modal" data-bs-target="#modalScrollable${index}"
                data-mydata="${category.discription}">more</a>`,
                category.createdOn

              ]

                
                
                console.log(categoryList);
                var data1 = [categorySave].map(function(row) {
                    var rowData = [
                      index,
                      row.categoryName,
                      `<a href="#" data-bs-toggle="modal" data-bs-target="#modalScrollable${index}"
                data-mydata="${row.categoryDescription}">more</a>`,
                row.createdOn
                    ];
                    return rowData;
                });
                console.log(`------------- data ---------`);
                console.log(data1);
                console.log(`------------- data1 ---------`);
                console.log(data);
                const response = {
                    data: data1
                  };
                res.json({ response: response, message: 'Category added successfully', status: 'success' });
            }else{
                res.json({ category: '', message: 'something wrong', status: 'faild' });

            }
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Failed to save category', error });
    }
  };
  
module.exports={
    productCategoryAdminGet,
    addCategoryAdminPost
}