const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    studentName: { type: String }, // Calculated as firstName + lastName
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    regNo: { type: String, required: true },
    department: { type: String, required: true },
    documentId: { type: String, required: true }, // Unique identifier for the document
studentId: { type: String },
    documentType: { type: String, required: true }, // Marksheet, Bonafide, Degree Certificate, etc.
    filePath: { type: String, required: true },
    fileHash: { type: String, required: true }, // SHA-256 Hash
    qrCode: { type: String }, // Base64 or URL
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    adminRemarks: { type: String },
    verifiedBy: { type: String }, // Admin Name or Authority
    uploadDate: { type: Date, default: Date.now },
    verificationDate: { type: Date }
});

module.exports = mongoose.model('Document', documentSchema);
