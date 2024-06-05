const authController = require('../controllers/logController');

const authRouter = (req, res) => {
    if (req.url === '/api/log' && req.method === 'POST') {
        authController.setJwt(req, res);
    } else if(req.url === '/api/log/username' && req.method === 'POST'){
        authController.getUserName(req, res);
    } else if(req.url === '/api/log/sign' && req.method === 'POST'){
        authController.createUser(req, res);
    } else if(req.url.match(/\/api\/users\/myaccount\/([a-zA-Z0-9-_. (){}\[\]!@#$%^&~]+)/) && req.method === 'GET') {
        console.log('Log Router: ', req.url);
        authController.accountInfo(req, res);
    } else if (req.url === '/api/users/myaccount' && req.method === 'PUT') {
        authController.updateUser(req, res);
    }
    else {
        res.writeHead(404, { 'Content-type': 'application/json' })
        res.end(JSON.stringify({ message: 'Route not found ' }))
    }
};

module.exports = authRouter;