const Razorpay = require("razorpay");
const express = require('express')
const router = express.Router();
const Cart = require("../models/Cart");
const crypto = require("crypto");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
    try {
        const { userId } = req.body;

        // Re-fetch cart from DB
        const cartItems = await Cart.find({ userId }).populate("productId");

        let subtotal = 0;

        cartItems.forEach(item => {
            const price = Number(item.productId.actualPrice) || 0;
            const discount = Number(item.productId.discount) || 0;
            const discountedPrice = Math.round(price - (price * discount / 100));
            subtotal += discountedPrice * item.quantity;
        });

        const shipping = subtotal > 5000 ? 0 : 99;
        const total = subtotal + shipping;

        const order = await razorpay.orders.create({
            amount: total * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        res.json({
            success: true,
            order,
            amount: total
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
router.post("/verify", async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            addressId
        } = req.body;

        // Verify Signature
        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        const isValid =
            generatedSignature === razorpay_signature;

        if (!isValid) {
            return res.status(400).json({
                success: false,
                msg: "Invalid payment signature"
            });
        }

        // Get Cart Items
        const cartItems = await Cart.find({
            userId
        }).populate("productId");

        if (!cartItems.length) {
            return res.status(400).json({
                success: false,
                msg: "Cart is empty"
            });
        }

        // Generate Order Number
        const lastOrder = await Order.findOne()
            .sort({ createdAt: -1 });

        const oid = String(
            parseInt(lastOrder?.orderId || 0) + 1
        );

        // Calculate Total Amount
        let totalAmount = 0;

        for (const item of cartItems) {

            const actualPrice =
                Number(item.productId.actualPrice) || 0;

            const discount =
                Number(item.productId.discount) || 0;

            const discountedPrice =
                actualPrice -
                (actualPrice * discount / 100);

            totalAmount +=
                discountedPrice * item.quantity;
        }

        // Shipping Charge
        const shipping =
            totalAmount > 5000 ? 0 : 99;

        totalAmount += shipping;

        // Create Main Order
        const newOrder = new Order({
            userId,
            orderId: oid,
            totalAmount,
            addressId,
            paymentMethod: "online",
            paymentStatus: "completed",
            orderStatus: "pending",
            transactionId: razorpay_payment_id
        });

        await newOrder.save();

        // Create Order Items
        for (const item of cartItems) {

            const orderItem = new OrderItem({
                orderId: newOrder._id,
                productId: item.productId._id,
                quantity: item.quantity
            });

            await orderItem.save();
        }

        // Clear Cart
        await Cart.deleteMany({ userId });

        return res.json({
            success: true,
            msg: "Payment verified and order created successfully"
        });

    } catch (error) {
        console.log(error);
        console.log(error.stack);

        res.status(500).json({
            success: false,
            msg: error.message
        });
    }
});

module.exports = router