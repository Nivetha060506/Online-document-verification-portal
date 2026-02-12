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

        // Simple recent docs
        const recentDocs = await Document.find().sort({ uploadDate: -1 }).limit(5).populate('studentId', 'name');

        res.json({
            totalStudents,
            totalDocuments,
            pendingDocs,
            approvedDocs,
            rejectedDocs,
            recentDocs
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await User.find().select('-password');
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Student Status (Block/Activate)
exports.updateStudentStatus = async (req, res) => {
    const { status } = req.body;
    try {
        let student = await User.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        student.status = status;
        await student.save();
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
