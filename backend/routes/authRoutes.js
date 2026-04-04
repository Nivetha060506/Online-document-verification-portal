const express = require('express');
const router = express.Router();
const {
    registerUser, loginUser, loginAdmin, getProfile, googleLogin,
    updateProfile, changePassword
} = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', loginAdmin);
router.post('/google-login', googleLogin);
router.get('/profile', auth, getProfile);
router.put('/profile/update', auth, updateProfile);
router.put('/profile/change-password', auth, changePassword);

module.exports = router;
