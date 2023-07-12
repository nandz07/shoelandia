const Color = require('../models/colorModel');

const productColorAdminGet=async (req,res)=>{
    try {
        const colors=await Color.find().exec()
        console.log(colors);
        res.render('admin/productColor',{colors: colors,admin:req.session.admin})
        
    } catch (error) {
        console.log(error);
    }
}
const addColorAdminGet=async (req,res)=>{
    try {
        res.render('admin/addColor',{message:'',admin:req.session.admin})
    } catch (error) {
        console.log(error);
    }
}
const addColorAdminPost=async (req,res)=>{
    try {
        let {colorName,colorDescription}=req.body

        console.log(colorName);
        console.log(colorDescription);
        const isColor=await Color.findOne({colorName:colorName})
        if(isColor){
            res.render('admin/addColor',{message:`Color ${colorName} is already exist`,status:`warning`,admin:req.session.admin})
        }else{
            const color = new Color({
                colorName:colorName,
                colorDescription:colorDescription,
                createdOn:Date.now()
            })
            const colorSave=await color.save();
            if(colorSave){
                res.render('admin/addColor',{message:`Color ${colorName} is added sucessfully`,status:'success',admin:req.session.admin})
            }else{
                res.render('admin/addColor',{message:`failed to add color`,status:'danger',admin:req.session.admin})
            }
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports={
    productColorAdminGet,
    addColorAdminGet,
    addColorAdminPost
}