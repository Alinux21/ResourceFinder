const authController = require('../controllers/logController');

const authRouter = (req, res) => {
    if (req.url === '/api/log' && req.method === 'POST') {
        authController.setJwt(req, res);
    } else if(req.url === '/api/log/username' && req.method === 'POST'){
        authController.getUserName(req, res);
    } else if(req.url === '/api/sign' && req.method === 'POST'){
        authController.createUser(req, res);
    }
    else {
        res.writeHead(404, { 'Content-type': 'application/json' })
        res.end(JSON.stringify({ message: 'Route not found ' }))
    }
};

module.exports = authRouter;