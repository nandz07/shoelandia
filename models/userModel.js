const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Boolean,
        required:true
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    is_blocked:{
        type:Boolean,
        required:true,
        default:false
    },
    wallet:{
        type:Number,
        default:0
    },
    ref:{
        type:String,
        default:false
    },
    createdOn: {
        type: Date,
        require: true,
        default: Date.now()
    },
    updatedOn: {
        type: Date,
        require: true,
        default: Date.now()
    },
});

const userModel = mongoose.model('user',userSchema);
module.exports = userModel