const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

// Load env from backend folder
dotenv.config({ path: path.join(__dirname, '.env') });

const checkData = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/verificationDB';
        console.log('Connecting to:', mongoURI);
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected');

        // Check for specific flag to reset passwords
        const resetFlag = process.argv.includes('--reset');

        if (resetFlag) {
            console.log('\n--- RESETTING CREDENTIALS ---');

            // Password to set
            const plainPassword = 'password123';

            // Fix Admin
            let admin = await Admin.findOne({ email: 'admin@gmail.com' });
            if (!admin) {
                admin = new Admin({ email: 'admin@gmail.com', password: plainPassword });
                console.log('Creating new admin: admin@gmail.com');
            } else {
                admin.password = plainPassword;
                console.log('Updating existing admin: admin@gmail.com');
            }
            await admin.save();
            console.log('Admin password reset to: password123');

            // Fix Student
            let student = await User.findOne({ email: 'student@gmail.com' });
            if (!student) {
                student = new User({
                    name: 'Student Test',
                    regNo: '2021CSE001',
                    department: 'CSE',
                    email: 'student@gmail.com',
                    password: plainPassword
                });
                console.log('Creating new student: student@gmail.com');
            } else {
                student.password = plainPassword;
                console.log('Updating existing student: student@gmail.com');
            }
            await student.save();
            console.log('Student password reset to: password123');
        }

        console.log('\n--- DB STATUS ---');
        const users = await User.find({});
        console.log('Users (Students) count:', users.length);
        users.forEach(u => console.log(`- [${u.email}] Hash: ${u.password.substring(0, 20)}... Status: ${u.status}`));

        const admins = await Admin.find({});
        console.log('Admins count:', admins.length);
        admins.forEach(a => console.log(`- [${a.email}] Hash: ${a.password.substring(0, 20)}...`));

        process.exit(0);
    } catch (err) {
        console.error('Error in checkData:', err);
        process.exit(1);
    }
};

checkData();
