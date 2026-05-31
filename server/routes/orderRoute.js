const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// Order place from cart
router.post("/order/cart", async (req, res) => {
    const { userId, paymentMethod, transactionId ,addressId} = req.body

    try {

        const cartItems = await Cart.find({ userId: userId }).lean()
        if (!cartItems || cartItems.length === 0) {
            return res.json({ msg: 'Cart is empty' })
        }


        const lastOrder = await Order.findOne().sort({ createdAt: -1 })
        const oid = String(parseInt(lastOrder?.orderId || 0) + 1)

       const newOrder = new Order({
    userId,
    addressId,
    orderId: oid,
    paymentMethod,
    paymentStatus:
      paymentMethod === "online"
      ? "completed"
      : "pending",
    orderStatus:"pending",
    transactionId
});
        await newOrder.save()


        for (const item of cartItems) {
            const orderItem = new OrderItem({
                orderId: newOrder._id,
                productId: item.productId,
                quantity: String(item.quantity),
            })
            await orderItem.save()
        }

        await Cart.deleteMany({ userId })

        res.json({ msg: 'Order placed successfully', orderId: oid })

    } catch (err) {
        console.error('Order error:', err)
        res.json({ msg: 'Failed to place order' })
    }
})

// Order history for a user
router.get("/order/history/:id", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.id })
            .sort({ createdAt: -1 })
            .lean()
        res.json({ msg: 'Order history fetched successfully', data: orders })
    } catch (err) {
        res.json({ msg: 'Failed to fetch order history' })
    }
})

// All orders for admin
router.get("/orders", async (req, res) => {
    try {
        const order = await Order.find().populate('userId').lean()
        res.json({ msg: 'All orders fetched successfully', data: order })
    } catch (err) {
        res.json({ msg: 'Failed to fetch all orders' })
    }
})



// Update order status and payment status

router.patch("/status/:id", async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body
        const updateFields = { orderStatus }
        if (paymentStatus) updateFields.paymentStatus = paymentStatus  // ← COD delivered pe
        const data = await Order.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        )
        res.json({ msg: 'Status updated', data })
    } catch (err) {
        res.json({ msg: 'Failed to update status' })
    }
})


//order search for a single user
router.get("/user/:id", async (req, res) => {
   
    try {
        const data = await Order.find({ userId: req.params.id }).lean()
        res.json({ msg: 'Order history fetched successfully', data: data })
    } catch (err) {
        res.json({ msg: 'Failed to fetch order history' })  
    }
})
module.exports = router