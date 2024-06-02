const User = require('../models/authModel.js');
const { getPostData } = require('../utils.js')
const jwt = require('jsonwebtoken');

async function checkUser(req, res) {

    try {
        const body = await getPostData(req);
        const jwtVar = JSON.parse(body);
        const decodedJtw = jwt.verify(jwtVar.token, "1234567890");

        const username = decodedJtw.tokenUsername;
        const password = decodedJtw.tokenPassword;

        const user = await User.checkUser(username, password);
        
        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: true }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: false, error: 'User not found' }));
        }
    } catch (error) {
        console.error('Error:', error);

        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: false, error: error.message }));
    }
}

module.exports = { checkUser };
