const mongoose = require('mongoose');

const addressSchema =  mongoose.Schema({
    userId: {
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
    houseNo: {
        type:String,
        required:true,  
    },
    pincode: {
        type:String,
        required:true,
    },
    city: {
        type:String,
        required:true,
    },
    state: {    
        type:String,
        required:true,
    },
    status: {
        type:String,
        enum:['active','inactive','delete'],
        default:'active'
    }
},{
    timestamps:true
});
module.exports = mongoose.model('Address', addressSchema);