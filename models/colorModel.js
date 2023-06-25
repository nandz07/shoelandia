// const mongoose = require('mongoose');
// const colorSchema = new mongoose.Schema({
//     colorName: {
//         type: String,
//         required: true
//     },
//     colorDescription: {
//         type: String
//     }
// })

// const colorModel = mongoose.model("color", colorSchema);
// module.exports = colorModel;
const mongoose = require('mongoose');



const colorSchema = new mongoose.Schema({
    colorName: {
        type: String,
        required: true
    },
    colorDescription: {
        type: String
    },
    createdOn: {
        type: Date,
        required: true,
    },
    updatedOn: {
        type: Date,
        default: null
    }
});

// colorSchema.pre('save', function (next) {
//     this.updated = new Date();
//     next();
// });

const colorModel = mongoose.model('color', colorSchema);
module.exports = colorModel;
