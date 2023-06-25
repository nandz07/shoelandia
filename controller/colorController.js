const Color = require('../models/colorModel');

const productColorAdminGet=async (req,res)=>{
    try {
        const colors=await Color.find().exec()
        console.log(colors);
        res.render('admin/productColor',{colors: colors})
        
    } catch (error) {
        console.log(error);
    }
}
const addColorAdminGet=async (req,res)=>{
    try {
        res.render('admin/addColor',{message:''})
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
            res.render('admin/addColor',{message:`Color ${colorName} is already exist`,status:`warning`})
        }else{
            const color = new Color({
                colorName:colorName,
                colorDescription:colorDescription,
                createdOn:Date.now()
            })
            const colorSave=await color.save();
            if(colorSave){
                res.render('admin/addColor',{message:`Color ${colorName} is added sucessfully`,status:'success'})
            }else{
                res.render('admin/addColor',{message:`failed to add color`,status:'danger'})
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