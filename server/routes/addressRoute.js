const express = require('express');
const router = express.Router();
const Address = require('../models/Address');

router.post('/', async (req, res) => {
    try{
    const data = await new Address(req.body);
    res.json({msg:'Address added successfully'})
    data.save();

    }
    catch(er){
        res.json({msg:'Failed to add address'})
    }
});

// address via paticular user
router.get('/:id', async (req, res) => {
    try{
        const data = await Address.find({userId:req.params.id, status:['active','default']}).lean();
        res.json({msg:'Address featch successfully', data:data})
    }
    catch(er){
        res.json({msg:'Failed to fetch address'})
    }
});

// defualt address
router.patch('/default/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const data = await Address.findByIdAndUpdate(req.params.id, {status:'default'},{new:true});
        res.json({msg:'Default address set successfully', data:data})
    }
    catch(er){
        res.json({msg:'Failed to set default address'})
    }
});

// delete address
router.delete('/:id', async (req, res) => {
    try{
        const data = await Address.findByIdAndDelete(req.params.id,{status:'inactive'},{new:true});
        res.json({msg:'Address deleted successfully', data:data})
    }
    catch(er){
        res.json({msg:'Failed to delete address'})
    }
});

module.exports = router;
