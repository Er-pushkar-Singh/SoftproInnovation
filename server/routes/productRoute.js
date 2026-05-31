const express = require('express')
const Product = require('../models/Product')
const router = express.Router()
const multer = require('multer')
const path = require('path')    
const fs = require('fs')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/product/'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    }
})
const uploads = multer({ storage: storage })

//post api
router.post('/', uploads.single('picture'), async (req, res) => {
    try {
        const { name, category, description, brandName, actualPrice, discount, images, tag, stock, attributes, height, width,
            stockStatus, refundPolicy, replacementPolicy, freeDelivery, returnPolicy, isCod } = req.body
        const p = await new Product({
            name: name,
            category: category,
            description: description,
            brandName: brandName,
            actualPrice: actualPrice,
            discount: discount,
            images: req.file ? 'uploads/product/' + req.file.filename : null,
            tag: tag,
            stock: stock,
            attributes: attributes,
            height: height,
            width: width,
            stockStatus: stockStatus,
            refundPolicy: refundPolicy,
            replacementPolicy: replacementPolicy,
            freeDelivery: freeDelivery,
            returnPolicy: returnPolicy,
            isCod: isCod

        })
        p.save();
        console.log(req.body);

        res.json({ msg: "Product Added Successfully" })

    }
    catch (er) {
        res.json({
            msg: er
        })
        console.log(req.body);


    }
})
//get api 
router.get('/', async (req, res) => {
  try{
    const data = await Product.find({status:'active'})
     .populate('category');
    res.json({msg:"Data Fetched",data:data});
  }catch(er){
     res.json({msg:"Sorry Data not Fetched",error:er})
  }
})

//put api
router.put('/:id', uploads.single("picture"), async (req, res) => {
    try {
        const { name, category, description, brandName, actualPrice, discount, tag, stock, attributes, height, width,
            stockStatus, refundPolicy, replacementPolicy, freeDelivery, returnPolicy, isCod } = req.body
        
        const updateFields = {
            name, category, description, brandName, actualPrice, discount, tag, stock, attributes, height, width,
            stockStatus, refundPolicy, replacementPolicy, freeDelivery, returnPolicy, isCod
        }

        if (req.file) {
            updateFields.images = 'uploads/product/' + req.file.filename;
        }

        const a = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true })
        res.json({ msg: "Product Updated Successfully" })
    } catch (err) {
        console.error(err);
        res.json({ msg: "Product Not Updated" })
    }
})

//delete api
router.delete('/:id', async (req, res) => {
    try {
        const p = await Product.findByIdAndDelete(req.params.id)
        if (p) {
            res.json({ msg: "Product Deleted Successfully" })
        } else {
            res.json({ msg: "Product Not Found" })
        }
    } catch (er) {
        res.json({ msg: "Error Deleting Product", error: er })
    }
})

//get api for home page
router.get('/products', async (req, res) => {
    try {
        const data = await Product.find({ status: 'active' }).populate('category');
        // const data = await Product.find().populate('category').limit(8).lean();
        res.json({ msg: "Data Fetched", data: data });
    } catch (er) {
        res.json({ msg: "Sorry Data not Fetched", error: er })
    }   
})

router.get('/details/:id', async (req, res) => {
    try {
        const data = await Product.findById(req.params.id)    //.populate('category');
        res.json({ msg: "Product Details Fetched", data: data });
    } catch (er) {
        res.json({ msg: "Sorry Product Details not Fetched", error: er })
    }
})

// Category ke saare products
router.get('/category/:id', async (req, res) => {
    try {
        const data = await Product.find({ category: req.params.id, status: 'active' }).populate('category')
        res.json({ msg: "Products fetched", data: data })
    } catch (er) {
        res.json({ msg: "Sorry data not fetched", error: er })
    }
})

// Quick stock update endpoint
router.patch('/:id/stock', async (req, res) => {
    try {
        const { stock, stockStatus } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock, stockStatus },
            { new: true }
        );
        res.json({ msg: "Stock level updated successfully", data: product });
    } catch (er) {
        res.json({ msg: "Failed to update stock level", error: er });
    }
});

module.exports = router;