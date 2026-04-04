const User = require('../models/User');
const Document = require('../models/Document');

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments();
        const totalDocuments = await Document.countDocuments();
        const pendingDocs = await Document.countDocuments({ status: 'Pending' });
        const approvedDocs = await Document.countDocuments({ status: 'Approved' });
        const rejectedDocs = await Document.countDocuments({ status: 'Rejected' });

        // Get upload trends for last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            const count = await Document.countDocuments({
                uploadDate: { $gte: startOfDay, $lte: endOfDay }
            });

            last7Days.push({ date: dateString, count });
        }

        // Simple recent docs
        const recentDocs = await Document.find().sort({ uploadDate: -1 }).limit(5).populate('studentId', 'name');

        res.json({
            totalStudents,
            totalDocuments,
            pendingDocs,
            approvedDocs,
            rejectedDocs,
            recentDocs,
            uploadTrends: last7Days
        });
    } catch (err) {
        console.error('[ADMIN ERROR] getDashboardStats:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get All Students (Ensuring uniqueness)
exports.getAllStudents = async (req, res) => {
    try {
        const students = await User.find().select('-password');

        // Logical safeguard for unique records if needed
        const uniqueStudents = [];
        const seen = new Set();

        for (const student of students) {
            const iden = student.email + '|' + student.regNo;
            if (!seen.has(iden)) {
                seen.add(iden);
                uniqueStudents.push(student);
            }
        }

        res.json(uniqueStudents);
    } catch (err) {
        console.error('[ADMIN ERROR] getAllStudents:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Update Student Status (Block/Activate)
exports.updateStudentStatus = async (req, res) => {
    const { status } = req.body;
    try {
        console.log(`[ADMIN] Updating status for student ${req.params.id} to ${status}`);
        let student = await User.findById(req.params.id);
        if (!student) {
            console.log(`[ADMIN] Student not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Student not found' });
        }

        student.status = status;
        await student.save();
        console.log(`[ADMIN] Status updated successfully for ${student.email}`);
        res.json(student);
    } catch (err) {
        console.error('[ADMIN ERROR] updateStudentStatus:', err);
        res.status(500).json({
            message: 'Internal Server Error during status update',
            error: err.message
        });
    }
};
