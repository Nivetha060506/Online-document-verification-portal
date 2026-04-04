const mongoose = require('mongoose');
const Document = require('./models/Document');
const dotenv = require('dotenv');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/odv_portal';

mongoose.connect(mongoURI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const docs = await Document.find().limit(1);
        if (docs.length > 0) {
            console.log('FOUND_DOC_ID:' + docs[0]._id);
            console.log('FOUND_DOC_TYPE:' + docs[0].documentType);
            console.log('FOUND_DOC_INST_ID:' + docs[0].documentId);
        } else {
            console.log('NO_DOCS_FOUND');
        }
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
