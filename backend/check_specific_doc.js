const mongoose = require('mongoose');
const Document = require('./models/Document');
const dotenv = require('dotenv');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/odv_portal';

mongoose.connect(mongoURI)
    .then(async () => {
        const doc = await Document.findById('6994aff0f0c61db4ebfb1608');
        console.log('DOC_RECORD:' + JSON.stringify(doc));
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
