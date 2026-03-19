const express = require('express')
const Category = require('../models/Category')
const router = express.Router()
const multer = require('multer')

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/category")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"_"+file.originalname)
    }
})
const uploads = multer({storage:storage})
 
router.post('/',uploads.single('picture'),async(req,res)=>{
    const {category,description,picture} = req.body
   try{
    const {category , description , picture} = req.body
    const b = await Category.findOne({category:category})
    if(b){
        return res.json("Category Alredy Exite")
    }
     const a= await new  Category({category:category,description:description,picture:req.file.path,status:'active'})
    a.save()
    res.json("Category added successfully")
   }
   catch{
    res.json({msg:"Something went wrong"})
   }
})
//featch api
router.get('/',async(req,res)=>{
   try{
    const data = await Category.find({status:['active','inactive']}).lean()
     res.json({msg:"data featch ", data:data})
   }
   catch{
    res.json({msg:"Sorry data naot found"})
   }
})

// put api 
router.put('/:id',async(req,res)=>{
   try{
    const data = await Category.findByIdAndUpdate(req.params.id,req.body,{new:true})
   res.json({msg:"Category Update successfully"})
   }
   catch(er){
res.json({msg:"Category not update"})
   }
})

// delete api
router.delete('/:id', async(req,res)=>{
    try{
        const data = await Category.findByIdAndUpdate(req.params.id,{status:'delete'},{new:true})
        res.json({msg:"Category Delete successfully"})
    }
    catch(er){
        res.json({msg:"Category not delete"})
    }
})

//home category route api
router.get('/home',async(req,res)=>{
    try{
        const cat = await Category.find({status:'active'}).sort({created_At:-1}).lean();
        res.json({msg:"Home category data fetched",data:cat})
    }
    catch(err){
        res.json({msg:"Error fetching home category data"})
    }
})
module.exports = router;