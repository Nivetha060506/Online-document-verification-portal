const User = require('../models/User');
const Admin = require('../models/Admin');
const Document = require('../models/Document');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper for safe JWT signing
const signToken = (id, role) => {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    return jwt.sign({ user: { id, role } }, secret, { expiresIn: '1d' });
};

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, regNo, department, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            regNo,
            department,
            email,
            password
        });

        await user.save();

        const token = signToken(user._id, 'student');

        res.status(201).json({
            token,
            role: 'student',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: 'student'
            }
        });
    } catch (err) {
        console.error('[AUTH ERROR] User Registration:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log(`[AUTH] Login User Attempt: ${email}`);

    try {
        // 1. Validate Input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required' });
        }

        // 2. Standard authentication
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        if (user.status === 'Blocked') {
            return res.status(403).json({ message: 'Your account has been blocked. Please contact admin.' });
        }

        // Update lastLogin
        try {
            user.lastLogin = Date.now();
            await user.save();
        } catch (saveErr) {
            console.error('[AUTH WARNING] Failed to update lastLogin:', saveErr.message);
        }

        const token = signToken(user._id, 'student');

        return res.status(200).json({
            token,
            role: 'student',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: 'student'
            }
        });

    } catch (err) {
        console.error('[AUTH ERROR] User Login Exception:', err);
        res.status(500).json({
            message: 'Server Error during login',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Login Admin Attempt: ${email}`);

    try {
        // 1. Validate Input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required' });
        }

        // 2. Find Admin
        let admin = await Admin.findOne({ email });

        // 3. Fail if Admin doesn't exist
        if (!admin) {
            console.log(`[AUTH] Admin login failed: Admin not found (${email})`);
            return res.status(401).json({ message: 'Invalid Email or Password' });
        } else {
            // 4. Verify Password for existing admins
            const isMatch = await admin.matchPassword(password);
            if (!isMatch) {
                console.log(`[AUTH] Admin login failed: Incorrect password for existing admin ${email}`);
                return res.status(401).json({ message: 'Invalid Email or Password' });
            }
        }

        // 5. Generate Token
        const token = signToken(admin._id, 'admin');

        return res.status(200).json({
            token,
            role: 'admin',
            user: {
                id: admin._id,
                email: admin.email,
                role: 'admin'
            }
        });

    } catch (err) {
        console.error('[AUTH ERROR] Admin Login Exception:', err);
        res.status(500).json({
            message: 'Server Error during admin login',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// @desc    Get User Profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get document stats
        const totalDocuments = await Document.countDocuments({ email: user.email });
        const pendingDocuments = await Document.countDocuments({ email: user.email, status: 'Pending' });
        const approvedDocuments = await Document.countDocuments({ email: user.email, status: 'Approved' });
        const rejectedDocuments = await Document.countDocuments({ email: user.email, status: 'Rejected' });

        res.status(200).json({
            user: {
                ...user._doc,
                stats: {
                    totalDocuments,
                    pendingDocuments,
                    approvedDocuments,
                    rejectedDocuments
                }
            }
        });
    } catch (err) {
        console.error('[AUTH ERROR] Get Profile:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile/update
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, department, regNo } = req.body;
        const user = await User.findById(req.user.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use by another student' });
            }
            user.email = email;
        }

        // Check if regNo is being changed and if it's already taken
        if (regNo && regNo !== user.regNo) {
            const regNoExists = await User.findOne({ regNo });
            if (regNoExists) {
                return res.status(400).json({ message: 'Registration number already in use' });
            }
            user.regNo = regNo;
        }

        if (name) user.name = name;
        if (department) user.department = department;

        await user.save();
        console.log(`[AUTH] Profile updated for ${user.email}`);

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                regNo: user.regNo,
                status: user.status,
                role: user.role
            }
        });
    } catch (err) {
        console.error('[AUTH ERROR] Update Profile Exception:', err);
        res.status(500).json({
            message: 'Internal Server Error during profile update',
            error: err.message
        });
    }
};

// @desc    Change Password
// @route   PUT /api/auth/profile/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        // Update to new password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('[AUTH ERROR] Change Password:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Google Login (Optional placeholder if needed, updated for real logic)
exports.googleLogin = async (req, res) => {
    // Keeping logic similar but emphasizing that it should check DB
    res.status(501).json({ message: 'Google Login requires specific OAuth setup for production.' });
};
