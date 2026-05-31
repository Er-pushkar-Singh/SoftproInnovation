const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// user registration
router.post('/register', async (req, res) => {
    const { name, email, mobile, password } = req.body;
    try {
        const isExist = await User.findOne({ email: req.body.email });
        if (isExist) {
            return res.json({ msg: "User Already Exist" });
        }

        const user = await new User({
            name: name,
            email: email,
            mobile: mobile,
            password: password
        });
        user.save();
        return res.json({ msg: "User Registered Successfully" });
    }
    catch (er) {
        res.json({ msg: "Sorry User Not Registered", error: er });
    }
})

// user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const isUser = await User.findOne({ email: email });
        if (!isUser) {
            return res.json({ msg: "Wrong Email Address" });
        }
        if (isUser.password == password) {
            const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
            return res.json({
                msg: "User Login Successfully",
                role: "User",
                token: token,
                id: isUser._id
            }) 
        }
       return res.json({ msg: "Wrong Password" });

    } catch (er) {
        res.json({ msg: "Service Unavailable", error: er });
    }
})

// get user details
router.get('/:id', async (req, res) => {
    try {
        const data = await User.findById(req.params.id).lean();
        res.json({ msg: "User details fetched successfully", data: data })
    }
    catch (er) {
        res.json({ msg: "Failed to fetch user details", error: er })
    }
})

// update user details
router.patch('/:id', async (req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ msg: "User details updated successfully", data: data })
    }   
    catch (er) {
        res.json({ msg: "Failed to update user details", error: er })       

    }
})

// delete user
router.delete('/:id', async (req, res) => {
    try {
        const data = await User.findByIdAndDelete(req.params.id);
        res.json({ msg: "User deleted successfully" })
    }
    catch (er) {
        res.json({ msg: "Failed to delete user", error: er })
    }
})

// change password
router.patch('/change-password/:id', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.json({ msg: "User not found" });
        }
        if (user.password !== oldPassword) {
            return res.json({ msg: "Incorrect old password" });
        }
        user.password = newPassword;
        await user.save();
        res.json({ msg: "Password changed successfully" });
    } catch (er) {
        res.json({ msg: "Failed to change password", error: er });
    }
});

// get all users (Admin only)
router.get('/', async (req, res) => {
    try {
        const data = await User.find({}).lean();
        res.json({ msg: "All users fetched successfully", data: data })
    }
    catch (er) {
        res.json({ msg: "Failed to fetch users", error: er })
    }
})

module.exports = router;
