const isLogin = (req,res,next)=>{
    if(req.session.adminLogedIn){

    }else{
        res.redirect('/admin/adminLogin');
    }
    next();
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