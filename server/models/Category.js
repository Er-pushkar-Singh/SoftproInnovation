const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    category:{
        type:String,
        require:true,
        unique:true
    },
       description:{
        type:String,
        require:true,
        unique:true
    },
       status:{
        type:String,
        require:true
       
    },
       picture:{
        type:String,
        require:true
        
    }
},
{
    timestamps:true
})
module.exports=mongoose.model("Category",categorySchema)