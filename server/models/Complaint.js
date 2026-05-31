const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    category:{
        type: String
    },
    message:{
        type: String,
        required: true
    },
    reply:{
        type: String,
        default: ''
    },
    status:{
        type: String,
        enum: ['pending', 'replied', 'closed'],
        default: 'pending'
    }
}, { timestamps: true })

module.exports = mongoose.model('Complaint', complaintSchema)
