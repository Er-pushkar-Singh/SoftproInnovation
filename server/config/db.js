const mongoose = require('mongoose')
const dotenv = require('dotenv')

const mongoDB = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(()=> {
    console.log("Database connected successfully");
})
.catch((err)=>{
    console.error(err);
    
})
}
module.exports= mongoDB;