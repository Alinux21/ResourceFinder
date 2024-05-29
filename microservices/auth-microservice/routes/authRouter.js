const authController = require('../controllers/authController');

const authRouter = (req, res) => {
    if (req.url === '/api/auth' && req.method === 'POST') {
        authController.checkUser(req, res);
    } else {
        res.writeHead(404, { 'Content-type': 'application/json' })
        res.end(JSON.stringify({ message: 'Route not found ' }))
    }
};

module.exports = authRouter;