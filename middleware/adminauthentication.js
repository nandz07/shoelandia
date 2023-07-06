const isLogin = (req,res,next)=>{
    try {
        if(req.session.adminLogedIn){
            next()
        }else{
            res.redirect('/admin/adminLogin');
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = (req,res,next)=>{
    if(req.session.adminLogedIn){
        res.redirect('/admin/dashboard');
    }
    next();
}

module.exports = {
    isLogin,
    isLogout
}