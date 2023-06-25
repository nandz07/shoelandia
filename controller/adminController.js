
const dashboardAdminGet=async (req,res)=>{
    try {
        res.render('admin/dashBoard')
    } catch (error) {
        console.log(error);
    }
}

const bannerAdminGet=async (req,res)=>{
    try {
        res.render('admin/banner')
    } catch (error) {
        console.log(error);
    }
}




module.exports={
    dashboardAdminGet,
    bannerAdminGet
}