const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brandName: {
        type: String
    },
    actualPrice: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true
    },
    images: {
        type: String,
        required: true
    },
    tag:{
        type:String
    },
    stock: {
        type: String,
        required: true
    },
    attributes: {
        type: String,
        required: true
    },
    height: {
        type: String
    },
    width: {
        type: String
    },
    status: {
        type: String,
        enum:['active','inactive','delete'],
        default:'active'
    },
    stockStatus:{
        type:String,
        enum:['outOfStock','inStock']
    },
    refundPolicy:{
        type:String
    },
    replacementPolicy:{
        type:String
    },
    freeDelivery:{
        type:String
    },
    returnPolicy:{
        type:String
    },
    isCod:{
        type:String
    }
},{
    timestamps:true
});
module.exports = mongoose.model("Product",productSchema)