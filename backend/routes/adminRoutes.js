const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getDashboardStats, getAllStudents, updateStudentStatus } = require('../controllers/adminController');

// All Admin routes should verify admin role
// Adding a simple middleware check here or inside controllers (for now relying on auth middleware + logic)
// ideally should have role middleware.

router.get('/stats', auth, getDashboardStats);
router.get('/students', auth, getAllStudents);
router.put('/student/:id/status', auth, updateStudentStatus);

module.exports = router;
