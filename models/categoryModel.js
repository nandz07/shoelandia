const mongoose = require("mongoose");
const categoryschema = mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryDescription: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    required: true,
  },
  updatedOn: {
    type: Date,
    default: null
  },
  trashBin: {
    type: Boolean,
    default: false
  }
});

categoryschema.pre('save', function (next) {
  this.updatedOn = new Date();
  next();
});
module.exports = mongoose.model("Category", categoryschema);

