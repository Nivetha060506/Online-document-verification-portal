const Document = require('../models/Document');
const crypto = require('crypto');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Upload Document
exports.uploadDocument = async (req, res) => {
    try {
        const { documentType, firstName, lastName, email, phoneNumber, regNo, department, documentId } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        // Basic Validation
        const requiredFields = ['documentType', 'firstName', 'lastName', 'email', 'phoneNumber', 'regNo', 'department', 'documentId'];
        for (let field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Field '${field}' is mandatory for institutional documentation.` });
            }
        }

        // Calculate SHA-256 Hash
        const fileBuffer = fs.readFileSync(file.path);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const hexHash = hashSum.digest('hex');

        const qrUrl = `http://localhost:3000/verify/${Date.now()}`; // Placeholder until ID is generated, or use a predictable ID if possible. Wait, Mongoose generates _id before save if we create instance.

        const newDoc = new Document({
            studentId: req.user.user.id,
            documentType,
            firstName,
            lastName,
            studentName: `${firstName} ${lastName}`,
            email,
            phoneNumber,
            regNo,
            department,
            documentId,
            filePath: file.path,
            fileHash: hexHash,
            status: 'Pending'
        });

        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${newDoc._id}`;
        const qrCodeImage = await QRCode.toDataURL(verificationUrl);
        newDoc.qrCode = qrCodeImage;

        await newDoc.save();
        res.json(newDoc);

    } catch (err) {
        console.error('Submission Error Details:', err);
        res.status(500).json({ message: 'System Integrity Error: ' + (err.message || 'Verification database unreachable') });
    }
};

exports.verifyDocumentPublic = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Return only public info
        console.log('DEBUG_DOC:', doc);
        res.json({
            id: doc._id,
            status: doc.status,
            studentName: doc.studentName || (doc.firstName && doc.lastName ? `${doc.firstName} ${doc.lastName}` : 'Not Available'),
            regNo: doc.regNo,
            department: doc.department,
            documentType: doc.documentType,
            documentId: doc.documentId,
            uploadDate: doc.uploadDate,
            verificationDate: doc.verificationDate,
            fileHash: doc.fileHash,
            verifiedBy: doc.verifiedBy || 'Admin Authority'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
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
// Get All Documents (Admin)
exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find().sort({ uploadDate: -1 });
        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
