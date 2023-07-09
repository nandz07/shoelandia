const userIsOrNot = (req,res,next)=>{
    try {
        let userLoggedIn=req.session.userLogedIn
         req.cId=userLoggedIn ? req.session.userId : req.sessionID;
        next()
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    userIsOrNot
}