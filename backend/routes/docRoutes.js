const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const { uploadDocument, getMyDocuments, getPendingDocuments, verifyDocument, getDocumentById, getAllDocuments } = require('../controllers/docController');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Images and PDFs only!'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
router.post('/upload', auth, upload.single('file'), uploadDocument);
router.get('/my-documents', auth, getMyDocuments);
router.get('/pending', auth, getPendingDocuments); // Admin only, add check?
router.get('/all', auth, getAllDocuments); // Admin only, add check?
router.get('/:id', auth, getDocumentById);
router.put('/verify/:id', auth, verifyDocument); // Admin only

// Public Verification Route
router.get('/verify/:id', require('../controllers/docController').verifyDocumentPublic);

module.exports = router;
