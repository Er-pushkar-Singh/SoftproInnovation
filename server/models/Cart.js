const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({    
    userId: {
        type:mongoose.Schema.ObjectId,
        ref:'User',
    },
    productId: {
        type:mongoose.Schema.ObjectId,
        ref:'Product',
    },
    quantity: {
        type:String,
        required:true,
        default:1
    }
},{
    timestamps:true
});
module.exports = mongoose.model('Cart', cartSchema);