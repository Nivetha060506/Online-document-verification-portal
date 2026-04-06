const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Admin = require('./models/Admin');

// Load environment variables from the same directory
dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI || !mongoURI.includes('mongodb+srv')) {
            console.error('ERROR: MONGO_URI is not set to a MongoDB Atlas cluster.');
            process.exit(1);
        }

        console.log('Connecting to:', mongoURI);
        await mongoose.connect(mongoURI);
        console.log('MongoDB Atlas Connected');

        // Student Data
        const students = [
            { name: 'Priya', email: 'priya@gmail.com', regNo: '2026STU001', department: 'CSE' },
            { name: 'Karthick', email: 'karthick@gmail.com', regNo: '2026STU002', department: 'IT' },
            { name: 'Renu', email: 'renu@gmail.com', regNo: '2026STU003', department: 'ECE' },
            { name: 'Maha', email: 'maha@gmail.com', regNo: '2026STU004', department: 'MECH' }
        ];

        const password = '12345'; // bcrypt will hash this in pre-save hook

        for (const s of students) {
            let user = await User.findOne({ email: s.email });
            if (!user) {
                user = new User({ ...s, password });
                await user.save();
                console.log(`[USER] Created: ${s.name} (${s.email})`);
            } else {
                 console.log(`[USER] Already exists: ${s.email}`);
            }
        }

        // Admin Data
        const adminData = { name: 'Nivii', email: 'nivi@gmail.com', password };
        let admin = await Admin.findOne({ email: adminData.email });
        if (!admin) {
            // Check Admin model schema
            admin = new Admin({ email: adminData.email, password: adminData.password });
            await admin.save();
            console.log(`[ADMIN] Created: ${adminData.email}`);
        } else {
             console.log(`[ADMIN] Already exists: ${adminData.email}`);
        }

        console.log('\nSeed complete! Please restart your backend to see changes.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
