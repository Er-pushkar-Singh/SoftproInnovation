const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

// Input validation helper
const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
};

// user registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, mobile, password, confirmPassword } = req.body;

        // Input validation
        if (!name || !email || !mobile || !password || !confirmPassword) {
            return res.status(400).json({ 
                success: false,
                msg: "Please provide all required fields" 
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ 
                success: false,
                msg: "Please provide a valid email" 
            });
        }

        if (!validateMobile(mobile)) {
            return res.status(400).json({ 
                success: false,
                msg: "Please provide a valid mobile number" 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false,
                msg: "Passwords do not match" 
            });
        }

        if (password.length < 8) {
            return res.status(400).json({ 
                success: false,
                msg: "Password must be at least 8 characters long" 
            });
        }

        const isExist = await User.findOne({ 
            $or: [{ email: email }, { mobile: mobile }] 
        });

        if (isExist) {
            return res.status(400).json({ 
                success: false,
                msg: "User with this email or mobile already exists" 
            });
        }

        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            mobile: mobile.trim(),
            password: password
        });

        await user.save();
        
        return res.status(201).json({ 
            success: true,
            msg: "User Registered Successfully" 
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ 
            success: false,
            msg: "Failed to register user", 
            error: error.message 
        });
    }
});

// user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                msg: "Please provide email and password" 
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ 
                success: false,
                msg: "Please provide a valid email" 
            });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

        if (!user) {
            return res.status(401).json({ 
                success: false,
                msg: "Invalid email or password" 
            });
        }

        const isPasswordMatch = await user.matchPassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({ 
                success: false,
                msg: "Invalid email or password" 
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '3d' }
        );

        return res.status(200).json({
            success: true,
            msg: "User Login Successfully",
            role: "User",
            token: token,
            id: user._id
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false,
            msg: "Service Unavailable", 
            error: error.message 
        });
    }
});

// get user details
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const data = await User.findById(req.params.id).select('-password').lean();
        
        if (!data) {
            return res.status(404).json({ 
                success: false,
                msg: "User not found" 
            });
        }

        return res.status(200).json({ 
            success: true,
            msg: "User details fetched successfully", 
            data: data 
        });
    } catch (error) {
        console.error('Fetch user error:', error);
        return res.status(500).json({ 
            success: false,
            msg: "Failed to fetch user details", 
            error: error.message 
        });
    }
});

// update user details
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const { name, mobile } = req.body;

        // Only allow updating specific fields
        const allowedFields = { name, mobile };
        Object.keys(allowedFields).forEach(key => 
            allowedFields[key] === undefined && delete allowedFields[key]
        );

        if (Object.keys(allowedFields).length === 0) {
            return res.status(400).json({ 
                success: false,
                msg: "No fields to update" 
            });
        }

        if (name && name.length < 3) {
            return res.status(400).json({ 
                success: false,
                msg: "Name must be at least 3 characters long" 
            });
        }

        if (mobile && !validateMobile(mobile)) {
            return res.status(400).json({ 
                success: false,
                msg: "Please provide a valid mobile number" 
            });
        }

        const data = await User.findByIdAndUpdate(
            req.params.id, 
            allowedFields, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!data) {
            return res.status(404).json({ 
                success: false,
                msg: "User not found" 
            });
        }

        return res.status(200).json({ 
            success: true,
            msg: "User details updated successfully", 
            data: data 
        });
    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({ 
            success: false,
            msg: "Failed to update user details", 
            error: error.message 
        });
    }
});

// delete user
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const data = await User.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({ 
                success: false,
                msg: "User not found" 
            });
        }

        return res.status(200).json({ 
            success: true,
            msg: "User deleted successfully" 
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ 
            success: false,
            msg: "Failed to delete user", 
            error: error.message 
        });
    }
});

// change password
router.patch('/change-password/:id', verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ 
                success: false,
                msg: "Please provide old password and new password" 
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ 
                success: false,
                msg: "New passwords do not match" 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false,
                msg: "Password must be at least 8 characters long" 
            });
        }

        const user = await User.findById(req.params.id).select('+password');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                msg: "User not found" 
            });
        }

        const isOldPasswordMatch = await user.matchPassword(oldPassword);

        if (!isOldPasswordMatch) {
            return res.status(401).json({ 
                success: false,
                msg: "Incorrect old password" 
            });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ 
            success: true,
            msg: "Password changed successfully" 
        });
    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ 
            success: false,
            msg: "Failed to change password", 
            error: error.message 
        });
    }
});

// get all users (Admin only)
router.get('/', verifyToken, async (req, res) => {
    try {
        const data = await User.find({}).select('-password').lean();
        
        return res.status(200).json({ 
            success: true,
            msg: "All users fetched successfully", 
            data: data 
        });
    } catch (error) {
        console.error('Fetch all users error:', error);
        return res.status(500).json({ 
            success: false,
            msg: "Failed to fetch users", 
            error: error.message 
        });
    }
});

module.exports = router;
