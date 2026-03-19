const e = require('express');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({   
    userId: {
        type:mongoose.Schema.ObjectId,
        ref:'User',
    },
    orderId: {
        type:String,
        required:true,
    },
    paymentMethod: {
        type:String,
        enum:['cod','online'],
        default:'cod'
    },
    paymentStatus: {
        type:String,
        enum:['pending','completed','failed'],
        default:'pending'
    },
    payment: {
        type:String
    },
    orderStatus: {
        type:String,
        enum:['pending','confirmed','shipped','dispatched','outForDelivery','delivered','cancelled','returned'],
        default:'pending'
    },
    transactionId: {
        type:String,
    },
},{
    timestamps:true
});
module.exports = mongoose.model('Order', orderSchema);