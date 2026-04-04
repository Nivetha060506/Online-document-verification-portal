async function checkApi() {
    try {
        const response = await fetch('http://localhost:5000/api/docs/verify/6994aff0f0c61db4ebfb1608');
        const data = await response.json();
        console.log('API_RESPONSE:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('API_ERROR:', err.message);
    }
}

checkApi();
