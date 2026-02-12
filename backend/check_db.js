const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Admin = require('./models/Admin');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to:', process.env.MONGO_URI);

        const users = await User.find({});
        console.log('Users found:', users.length);
        users.forEach(u => console.log(`- User: ${u.email}, Pwd: ${u.password.substring(0, 10)}...`));

        const admins = await Admin.find({});
        console.log('Admins found:', admins.length);
        admins.forEach(a => console.log(`- Admin: ${a.email}, Pwd: ${a.password.substring(0, 10)}...`));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
