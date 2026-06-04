const mongoose = require('mongoose');

const mongoDB = () => {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is not defined in environment variables');
        process.exit(1);
    }

    mongoose.connect(process.env.MONGO_URI, {
        retryWrites: true,
        w: 'majority'
    })
        .then(() => {
            console.log("Database connected successfully");
        })
        .catch((err) => {
            console.error("Database connection error:", err.message);
            process.exit(1);
        });
};

module.exports = mongoDB;
