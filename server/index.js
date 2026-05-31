const express = require('express')
const cors = require('cors');
const mongoDB = require('./config/db');
const dotenv = require('dotenv')
const path = require('path');
const helmet = require('helmet');
const ratelimit = require('express-rate-limit');
dotenv.config();

const app = express()  // server create successfully
//middlewares applied here
app.use(cors());
app.use(express.json());

mongoDB();

// app.use(express.urlencoded({ extended: true })); // IMPORTANT

// ✅ Static folder for images {api for serving stactic files}
// const userlimit = ratelimit({
//     windowMs: 60 * 1000, // 1 minute
//     messages: "Too many requests from this IP, please try again after a minute",
//     limit: 5
// })

app.use(helmet());
app.use('/api/', express.static('./uploads'))
// api's started
app.use('/api/admin', require('./routes/adminRoute'))
//api's ended

//category api started
app.use('/api/category', require('./routes/categoryRoute'))

//product api
app.use('/api/product', require('./routes/productRoute'))


//user api
app.use('/api/user', require('./routes/userRoute'));

//cart api
app.use('/api/cart', require('./routes/cartRoute'))
//ordee api
 
app.use('/api/order/', require('./routes/orderRoute'))
//address api
app.use('/api/address', require('./routes/addressRoute'))

//complaint api
app.use('/api/complaint', require('./routes/complaintRoute'))

// api for payment
app.use("/api/payment", require("./routes/paymentRoute"));
//server started from here



app.listen(process.env.PORT, () => {
    console.log("Server started successfully");

})