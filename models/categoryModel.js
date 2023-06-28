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
  status: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Category", categoryschema);

