const mongoose = require("mongoose");
const sizeSchema = mongoose.Schema({
size: {
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

module.exports = mongoose.model("Size", sizeSchema);

