const Document = require('../models/Document');
const crypto = require('crypto');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Upload Document
exports.uploadDocument = async (req, res) => {
    try {
        const { documentType } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        // Calculate SHA-256 Hash
        const fileBuffer = fs.readFileSync(file.path);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const hexHash = hashSum.digest('hex');

        // Check if document with same hash already exists
        const existingDoc = await Document.findOne({ fileHash: hexHash });
        if (existingDoc) {
            // Optional: Decide if we want to block duplicate uploads or allow linking to new user?
            // For now, let's warn but proceed or just return the existing if it was the same user?
            // Let's just proceed for now but maybe flag it? Implementation detail.
        }

        // Generate QR Code data (e.g., URL to verify page with Doc ID)
        // In a real app, this URL would point to the frontend verification page
        // const verificationUrl = \`http://localhost:3000/verify/\${hexHash}\`;

        // For now, we'll store the hash and ID in the QR code
        const qrData = JSON.stringify({
            hash: hexHash,
            type: documentType,
            originalName: file.originalname
        });

        const qrCodeImage = await QRCode.toDataURL(qrData);

        const newDoc = new Document({
            studentId: req.user.user.id,
            documentType,
            filePath: file.path,
            fileHash: hexHash,
            qrCode: qrCodeImage,
            status: 'Pending'
        });

        await newDoc.save();
        res.json(newDoc);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get My Documents
exports.getMyDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ studentId: req.user.user.id }).sort({ uploadDate: -1 });
        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Pending Documents (Admin)
exports.getPendingDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ status: 'Pending' }).populate('studentId', 'name regNo');
        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Verify/Reject Document (Admin)
exports.verifyDocument = async (req, res) => {
    const { status, adminRemarks } = req.body;
    try {
        let document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found' });

        document.status = status; // Approved or Rejected
        document.adminRemarks = adminRemarks;
        if (status === 'Approved') {
            document.verificationDate = Date.now();
        }

        await document.save();
        res.json(document);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Single Document with details
exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id).populate('studentId', 'name regNo department email');
        if (!document) return res.status(404).json({ message: 'Document not found' });
        res.json(document);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
