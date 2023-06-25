
const homeGet=async (req,res)=>{
    try {
        res.render('users/index')
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    homeGet
}