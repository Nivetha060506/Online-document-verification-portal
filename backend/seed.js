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
        const admin = new Admin({
            email: 'admin@odv.com',
            password: 'admin123'
        });
        await admin.save();
        console.log('Admin Created: admin@odv.com / admin123');

        // Create Students
        await User.create([
            {
                name: 'John Doe',
                regNo: 'REG001',
                department: 'Computer Science',
                email: 'john@student.com',
                password: 'student123',
                status: 'Active'
            },
            {
                name: 'Jane Smith',
                regNo: 'REG002',
                department: 'Information Technology',
                email: 'jane@student.com',
                password: 'student123',
                status: 'Active'
            },
            {
                name: 'Mike Johnson',
                regNo: 'REG003',
                department: 'Electronics',
                email: 'mike@student.com',
                password: 'student123',
                status: 'Blocked'
            }
        ]);
        const students = await User.find();
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
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@student.com',
                phoneNumber: '1234567890',
                regNo: 'REG001',
                department: 'Computer Science',
                documentId: 'DOC001',
                filePath: 'uploads/sample_marksheet.pdf',
                fileHash: 'dummyhash123',
                status: 'Pending',
                uploadDate: new Date()
            },
            {
                studentId: students[0]._id,
                documentType: 'Bonafide',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@student.com',
                phoneNumber: '1234567890',
                regNo: 'REG001',
                department: 'Computer Science',
                documentId: 'DOC002',
                filePath: 'uploads/sample_bonafide.pdf',
                fileHash: 'dummyhash456',
                status: 'Approved',
                adminRemarks: 'Verified successfully',
                verificationDate: new Date(),
                uploadDate: new Date(Date.now() - 86400000)
            },
            {
                studentId: students[1]._id,
                documentType: 'Degree Certificate',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@student.com',
                phoneNumber: '0987654321',
                regNo: 'REG002',
                department: 'Information Technology',
                documentId: 'DOC003',
                filePath: 'uploads/sample_degree.pdf',
                fileHash: 'dummyhash789',
                status: 'Rejected',
                adminRemarks: 'Image validation failed',
                verificationDate: new Date(),
                uploadDate: new Date(Date.now() - 172800000)
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
