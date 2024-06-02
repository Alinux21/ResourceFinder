
const http = require('http');
const gatewayRouter = require('./routes/gatewayRouter.js');

const PORT = 5010;

const server = http.createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200); // Respond OK to preflight request
        res.end();
        return;
    }

    gatewayRouter(req, res);

});


server.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}/api`);
});
