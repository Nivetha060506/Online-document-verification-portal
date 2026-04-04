const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/verificationDB';
mongoose.connect(mongoURI)
    .then(() => console.log(`MongoDB Connected to: ${mongoURI}`))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); // Exit if DB connection fails
    });

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/docs', require('./routes/docRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health Check
app.get('/health', (req, res) => {
    console.log('[HEALTH CHECK] Called');
    res.status(200).send('Server is running');
});

// Root Route for Easy Browser Check
app.get('/', (req, res) => {
    res.status(200).send('API is running on port 5000');
});

// Serve Uploads
app.use('/uploads', express.static('uploads'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[GLOBAL ERROR]', err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
