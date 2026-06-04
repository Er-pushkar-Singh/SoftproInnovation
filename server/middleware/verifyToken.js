const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ 
                success: false,
                msg: "Authorization header is missing" 
            });
        }

        const tokenArray = authHeader.split(' ');

        if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
            return res.status(401).json({ 
                success: false,
                msg: "Invalid authorization format. Use 'Bearer <token>'" 
            });
        }

        const token = tokenArray[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                msg: "Token is missing" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                msg: "Token has expired" 
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                msg: "Invalid token" 
            });
        }

        console.error('Token verification error:', error);
        return res.status(500).json({ 
            success: false,
            msg: "Something went wrong during token verification" 
        });
    }
};

module.exports = verifyToken;
