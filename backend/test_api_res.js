const axios = require('axios');

async function checkApi() {
    try {
        const res = await axios.get('http://localhost:5000/api/docs/verify/6994aff0f0c61db4ebfb1608');
        console.log('API_RESPONSE:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('API_ERROR:', err.message);
    }
}

checkApi();
