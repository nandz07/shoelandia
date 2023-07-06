const multer = require('multer');
const fs=require('fs')
const path=require('path')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        let dir=path.join(__dirname,'../public/admin/productImages')
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        cb(null,dir)
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})
const upload = multer({storage:storage});

module.exports = upload
