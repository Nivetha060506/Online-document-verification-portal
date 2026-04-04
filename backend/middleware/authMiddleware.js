const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;

        // Check user status if it's a student
        if (decoded.user.role === 'student') {
            const User = require('../models/User');
            const user = await User.findById(decoded.user.id);
            if (user && user.status === 'Blocked') {
                return res.status(403).json({ message: 'Your account has been blocked by the administrator. Please contact the admin.' });
            }
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
