const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart"); 

// Add to cart
router.post("/", async (req, res) => {
    const { userId, productId} = req.body;
    try {
    const a = await new Cart(req.body)
    a.save()
    res.json({msg:'Product added to cart'})
    } 
    catch (err) {
        res.json({msg:'Failed to add product to cart'})
    }
});

// Get cart items for a user
router.get("/:id", async (req, res) => {
    try {
        const data = await Cart.find({ userId: req.params.id }).populate('productId').lean();
        res.json({msg:'Cart item fetched', data:data})
    } catch (err) {
        res.json({msg:'Failed to fetch cart items'})
    }
});

// Update cart item quantity
router.patch("/quantity/increase/:id", async (req, res) => {
    try {
    //   const quant = await Cart.find(req.params.id);
    const quant = await Cart.findById(req.params.id);

      if(quant.quantity<=5){
              let c = parseInt(quant.quantity) + 1;
        const a = await Cart.findByIdAndUpdate(req.params.id, { quantity: c }, { new: true });
        res.json({msg:'Cart item updated', data:a})
      } else {
        res.json({msg:'ONLY 5 QUANTITY ALLOWED'})
      }
    } catch (err) {
        res.json({msg:'Sorry, failed to update cart item quantity'})
    }
});

// Decrease cart item quantity
router.patch("/quantity/decrease/:id", async (req, res) => {
    try {   
        const quant = await Cart.findById(req.params.id);
        if(quant.quantity<=1){
            
            res.json({msg:'Cart item  should be not less than 1', data:quant})
        } else {
            let c = parseInt(quant.quantity) - 1;
            const a = await Cart.findByIdAndUpdate(req.params.id, { quantity: c }, { new: true });
            res.json({msg:'Cart item quantity decreased', data:a})
        }
    } catch (err) {
        res.json({msg:'Sorry, failed to decrease cart item quantity'})
    }
});

// Remove from cart
router.delete("/:id", async (req, res) => {
    try {
        const data = await Cart.findByIdAndDelete(req.params.id);
        res.json({msg:'Cart item removed'})
    } catch (err) {
        res.json({msg:'Failed to remove cart item'})
    }
});

module.exports = router;