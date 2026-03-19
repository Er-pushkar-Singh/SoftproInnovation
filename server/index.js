const express = require('express')
const cors = require('cors');
const mongoDB = require('./config/db');
const dotenv = require('dotenv')
const path = require('path');
dotenv.config();

const app = express()  // server create successfully
//middlewares applied here
app.use(cors());
app.use(express.json());

mongoDB();

// app.use(express.urlencoded({ extended: true })); // IMPORTANT

// ✅ Static folder for images {api for serving stactic files}


// api's started
app.use('/api/admin',require('./routes/adminRoute'))
//api's ended

//category api started
app.use('/api/category',require('./routes/categoryRoute'))

//product api
app.use('/api/product', require('./routes/productRoute'))


//user api
app.use('/api/user',require('./routes/userRoute'));

//cart api
app.use('/api/cart',require('./routes/cartRoute'))
//ordee api
app.use('/api/order/',require('./routes/orderRoute'))
//address api
app.use('/api/address',require('./routes/addressRoute'))
//server started from here


//
app.use('/api/',express.static('./uploads'))
app.listen(process.env.PORT,()=>{
    console.log("Server started successfully");
    
})