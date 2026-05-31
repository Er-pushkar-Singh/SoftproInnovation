const jwt = require('jsonwebtoken');
const express = require('express');
// const router = express.Router();

const verifyToken = (req, res, next) => {
    const a = req.headers.authorization;
    const token = a.split(' ')[1];
    if (!token) {
        return res.json({ msg: "Unauthorized access" });
    }
    try {
        const b = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (er) {
        res.json({ msg: "Something went wrong" });
    }
}

module.exports = verifyToken;