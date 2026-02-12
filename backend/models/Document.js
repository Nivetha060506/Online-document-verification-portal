const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    documentType: { type: String, required: true }, // Marksheet, Bonafide, Degree Certificate, etc.
    filePath: { type: String, required: true },
    fileHash: { type: String, required: true }, // SHA-256 Hash
    qrCode: { type: String }, // Base64 or URL
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    adminRemarks: { type: String },
    uploadDate: { type: Date, default: Date.now },
    verificationDate: { type: Date }
});

module.exports = mongoose.model('Document', documentSchema);
