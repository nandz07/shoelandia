const verify_user = (req,res,next)=>{
    try {
        if(req.session.userId){
            next()
        }else{
            res.redirect('/')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const logout_user = (req,res,next)=>{
    try {
        if(req.session.userId){
           res.redirect('/');
        }else{
           next()
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    verify_user,
    logout_user
}