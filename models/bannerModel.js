const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
    banner:[{
        image:{
            type:String,
            required:true
        },
        header:{
            type:String
        },
        description:{
            type:String
        }
    }]
})

const bannerModel = mongoose.model("banner",bannerSchema);
module.exports = bannerModel;