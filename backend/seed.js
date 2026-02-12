const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Document = require('./models/Document');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Admin.deleteMany({});
        await Document.deleteMany({});
        console.log('Data Cleared');

        // Create Admin
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const admin = new Admin({
            email: 'admin@odv.com',
            password: adminPassword
        });
        await admin.save();
        console.log('Admin Created: admin@odv.com / admin123');

        // Create Students
        const studentPassword = await bcrypt.hash('student123', salt);

        const students = await User.insertMany([
            {
                name: 'John Doe',
                regNo: 'REG001',
                department: 'Computer Science',
                email: 'john@student.com',
                password: studentPassword,
                status: 'Active'
            },
            {
                name: 'Jane Smith',
                regNo: 'REG002',
                department: 'Information Technology',
                email: 'jane@student.com',
                password: studentPassword,
                status: 'Active'
            },
            {
                name: 'Mike Johnson',
                regNo: 'REG003',
                department: 'Electronics',
                email: 'mike@student.com',
                password: studentPassword,
                status: 'Blocked'
            }
        ]);
        console.log('Students Created: john@student.com / student123, etc.');

        // Create Documents
        // Note: filePath needs to be valid if we want to "view" it, but for listing it doesn't matter.
        // We'll use a placeholder string or a real file if one exists. 
        // Since we can't easily upload a file via script without fs manipulation, we'll just point to a dummy path.
        // User might need to upload a real file to see the preview work perfectly, 
        // but this allows viewing the tables.

        const docs = await Document.insertMany([
            {
                studentId: students[0]._id,
                documentType: 'Marksheet',
                filePath: 'uploads/sample_marksheet.pdf', // Dummy path
                fileHash: 'dummyhash123',
                status: 'Pending',
                uploadDate: new Date()
            },
            {
                studentId: students[0]._id,
                documentType: 'Bonafide',
                filePath: 'uploads/sample_bonafide.pdf',
                fileHash: 'dummyhash456',
                status: 'Approved',
                adminRemarks: 'Verified successfully',
                verificationDate: new Date(),
                uploadDate: new Date(Date.now() - 86400000) // Yesterday
            },
            {
                studentId: students[1]._id,
                documentType: 'Degree Certificate',
                filePath: 'uploads/sample_degree.pdf',
                fileHash: 'dummyhash789',
                status: 'Rejected',
                adminRemarks: 'Image validation failed',
                verificationDate: new Date(),
                uploadDate: new Date(Date.now() - 172800000) // 2 days ago
            }
        ]);
        console.log('Documents Created');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
