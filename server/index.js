const express = require('express');
const cors = require('cors');
const mongoDB = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const ratelimit = require('express-rate-limit');

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Error: Environment variable ${varName} is not defined`);
        process.exit(1);
    }
});

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for API endpoints
const apiLimiter = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Connect to MongoDB
mongoDB();

// Static folder for images
app.use('/api/', express.static('./uploads'));

// API Routes
app.use('/api/admin', require('./routes/adminRoute'));
app.use('/api/category', require('./routes/categoryRoute'));
app.use('/api/product', require('./routes/productRoute'));
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/cart', require('./routes/cartRoute'));
app.use('/api/order/', require('./routes/orderRoute'));
app.use('/api/address', require('./routes/addressRoute'));
app.use('/api/complaint', require('./routes/complaintRoute'));
app.use('/api/payment', require('./routes/paymentRoute'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        msg: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Route not found"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started successfully on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Server is shutting down gracefully');
    process.exit(0);
});
