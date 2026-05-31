const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
        required: true
    },

    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true
    },

    quantity: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
});

module.exports =
    mongoose.model("OrderItem", orderItemSchema);