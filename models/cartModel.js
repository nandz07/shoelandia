// const { ObjectId } = require('mongodb');
// const mongoose = require('mongoose');

// const productSchema=new mongoose.Schema({
//     product_id:{
//         type:ObjectId,
//         ref:'product'
//     },
//     quantity:{
//         type:Number,
//     },
//     price:{
//         type:Number,

//     },
//     totalPrice : {
//         type : Number,
//     },
// })

// const cartSchema=new mongoose.Schema({
//     products:[productSchema],
//     user_id:{
//         type:String,
//     }
// })

// module.exports = mongoose.model('cart', cartSchema);

// const { ObjectId } = require('mongodb');
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   product_id: {
//     type: ObjectId,
//     ref: 'product'
//   },
//   quantity: {
//     type: Number,
//   },
//   price: {
//     type: Number,
//   },
//   totalPrice: {
//     type: Number,
//   },
// });

// const cartSchema = new mongoose.Schema({
//   products: [productSchema],
//   user_id: {
//     type: String, // Keep the initial type as string
//   },
// });

// // Add a virtual property to convert user_id to ObjectId type
// cartSchema.virtual('user', {
//   ref: 'user',
//   localField: 'user_id',
//   foreignField: '_id',
//   justOne: true
// });

// // Use a pre-save middleware to update user_id to ObjectId type
// cartSchema.pre('save', async function(next) {
//   if (this.isModified('user_id')) {
//     const User = mongoose.model('user');
//     const user = await User.findById(this.user_id);
//     if (user) {
//       this.user_id = user._id;
//     }
//   }
//   next();
// });

// module.exports = mongoose.model('cart', cartSchema);


// const { ObjectId } = require('mongodb');
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   product_id: {
//     type: ObjectId,
//     ref: 'product'
//   },
//   quantity: {
//     type: Number,
//   },
//   price: {
//     type: Number,
//   },
//   totalPrice: {
//     type: Number,
//   },
// });

// const cartSchema = new mongoose.Schema({
//   products: [productSchema],
//   user_id: {
//     type: String, // Keep the initial type as string
//   },
// });

// // Add a virtual property to convert user_id to ObjectId type
// cartSchema.virtual('user', {
//   ref: 'user',
//   localField: 'user_id',
//   foreignField: '_id',
//   justOne: true
// });

// // Use a pre-save middleware to update user_id to ObjectId type
// cartSchema.pre('save', async function(next) {
//   if (this.isModified('user_id')) {
//     try {
//       const User = mongoose.model('user');
//       const user = await User.findById(this.user_id);
//       if (user) {
//         this.user_id = user._id.toString(); // Convert to ObjectId string
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   next();
// });

// module.exports = mongoose.model('cart', cartSchema);

// const { ObjectId } = require('mongodb');
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   product_id: {
//     type: ObjectId,
//     ref: 'product'
//   },
//   quantity: {
//     type: Number,
//   },
//   price: {
//     type: Number,
//   },
//   totalPrice: {
//     type: Number,
//   },
// });

// const cartSchema = new mongoose.Schema({
//   products: [productSchema],
//   user_id: {
//     type: String, // Keep the initial type as string
//   },
// });

// // Add a virtual property to convert user_id to ObjectId type
// cartSchema.virtual('user', {
//   ref: 'user',
//   localField: 'user_id',
//   foreignField: '_id',
//   justOne: true
// });

// // Use a pre-save middleware to update user_id to ObjectId type
// cartSchema.pre('save', async function(next) {
//   if (this.isModified('user_id')) {
//     try {
//       const User = mongoose.model('user');
//       const user = await User.findOne({ _id: this.user_id });
//       if (user) {
//         this.user_id = user._id; // Assign the ObjectId directly
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   next();
// });

// module.exports = mongoose.model('cart', cartSchema);

// const { ObjectId } = require('mongodb');
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   product_id: {
//     type: ObjectId,
//     ref: 'product'
//   },
//   quantity: {
//     type: Number,
//   },
//   price: {
//     type: Number,
//   },
//   totalPrice: {
//     type: Number,
//   },
// });

// const cartSchema = new mongoose.Schema({
//   products: [productSchema],
//   user_id: {
//     type: String, // Keep the initial type as string
//   },
// });

// // Add a virtual property to convert user_id to ObjectId type
// cartSchema.virtual('user', {
//   ref: 'user',
//   localField: 'user_id',
//   foreignField: '_id',
//   justOne: true
// });

// // Use a pre-save middleware to update user_id to ObjectId type
// cartSchema.pre('save', async function(next) {
//   if (this.isModified('user_id')) {
//     try {
//       const User = mongoose.model('user');
//       const user = await User.findById(ObjectId(this.user_id));
//       if (user) {
//         this.user_id = user._id; // Assign the ObjectId directly
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   next();
// });

// module.exports = mongoose.model('cart', cartSchema);


// const { ObjectId } = require('mongodb');
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   product_id: {
//     type: ObjectId,
//     ref: 'product'
//   },
//   quantity: {
//     type: Number,
//   },
//   price: {
//     type: Number,
//   },
//   totalPrice: {
//     type: Number,
//   },
// });

// const cartSchema = new mongoose.Schema({
//   products: [productSchema],
//   user_id: {
//     type: String, // Keep the initial type as string
//   },
// });

// // Add a virtual property to convert user_id to ObjectId type
// cartSchema.virtual('user', {
//   ref: 'user',
//   localField: 'user_id',
//   foreignField: '_id',
//   justOne: true
// });

// // Use a pre-save middleware to update user_id to ObjectId type
// cartSchema.pre('save', async function(next) {
//   if (this.isModified('user_id')) {
//     try {
//       const User = mongoose.model('user');
//       const user = await User.findById(new ObjectId(this.user_id));
//       if (user) {
//         this.user_id = user._id; // Assign the ObjectId directly
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   next();
// });

// module.exports = mongoose.model('cart', cartSchema);

// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   product_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'product'
//   },
//   quantity: {
//     type: Number,
//   },
//   price: {
//     type: Number,
//   },
//   totalPrice: {
//     type: Number,
//   },
// });

// const cartSchema = new mongoose.Schema({
//   products: [productSchema],
//   user_id: {
//     type: String, // Keep the initial type as string
//   },
// });

// // Add a virtual property to convert user_id to ObjectId type
// cartSchema.virtual('user', {
//   ref: 'user',
//   localField: 'user_id',
//   foreignField: '_id',
//   justOne: true
// });

// // Use a pre-save middleware to update user_id to ObjectId type
// cartSchema.pre('save', async function(next) {
//   if (this.isModified('user_id')) {
//     try {
//       const User = mongoose.model('user');
//       const user = await User.findById(mongoose.Types.ObjectId(this.user_id));
//       if (user) {
//         this.user_id = user._id; // Assign the ObjectId directly
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   next();
// });

// module.exports = mongoose.model('cart', cartSchema);

// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   product_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'product'
//   },
//   quantity: {
//     type: Number,
//   },
//   price: {
//     type: Number,
//   },
//   totalPrice: {
//     type: Number,
//   },
// });

// const cartSchema = new mongoose.Schema({
//   products: [productSchema],
//   user_id: {
//     type: String, // Keep the initial type as string
//   },
// });

// // Add a virtual property to convert user_id to ObjectId type
// cartSchema.virtual('user', {
//   ref: 'user',
//   localField: 'user_id',
//   foreignField: '_id',
//   justOne: true
// });

// // Use a pre-save middleware to update user_id to ObjectId type
// cartSchema.pre('save', async function(next) {
//   if (this.isModified('user_id')) {
//     try {
//       const User = mongoose.model('user');
//       const user = await User.findById(new mongoose.Types.ObjectId(this.user_id));
//       if (user) {
//         this.user_id = user._id; // Assign the ObjectId directly
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   next();
// });

// module.exports = mongoose.model('cart', cartSchema);


// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   product_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'product'
//   },
//   quantity: {
//     type: Number,
//   },
//   price: {
//     type: Number,
//   },
//   totalPrice: {
//     type: Number,
//   },
// });

// const cartSchema = new mongoose.Schema({
//   products: [productSchema],
//   user_id: {
//     type: String, // Keep the initial type as string
//   },
// });

// // Add a virtual property to convert user_id to ObjectId type
// cartSchema.virtual('user', {
//   ref: 'user',
//   localField: 'user_id',
//   foreignField: '_id',
//   justOne: true
// });

// // Use a pre-save middleware to update user_id to ObjectId type
// cartSchema.pre('save', async function(next) {
//   if (this.isModified('user_id')) {
//     try {
//       const User = mongoose.model('user');
//       const user = await User.findById(mongoose.Types.ObjectId(this.user_id).toString());
//       if (user) {
//         this.user_id = user._id; // Assign the ObjectId directly
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   next();
// });

// module.exports = mongoose.model('cart', cartSchema);


const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: {
    type: ObjectId,
    ref: 'product'
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
});

const cartSchema = new mongoose.Schema({
  products: [productSchema],
  session_id: {
    type: String, // Initially saved as string
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Updated to ObjectId
    ref: 'user' // Replace 'user' with the actual user collection name
  },
});

module.exports = mongoose.model('cart', cartSchema);
