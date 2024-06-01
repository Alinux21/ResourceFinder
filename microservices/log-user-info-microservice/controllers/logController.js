const User = require('../models/logModel.js');
const { getPostData } = require('../utils.js')
const jwt = require('jsonwebtoken');

async function checkUser(req, res) {

    const body = await getPostData(req);
    const { username, password } = JSON.parse(body);

    console.log(username, password);
    try {
        const user = await User.checkUser(username, password);
        if (user) {

            const secret = '1234567890';
            const payload = {
                tokenUsername: username,
                tokenPassword: password
            };
            const token = jwt.sign(payload, secret);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token }));
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

async function getUserName(req, res) {
    try {
        const body = await getPostData(req);
        const jwtVar = JSON.parse(body);
        const decodedJtw = jwt.verify(jwtVar.token, "1234567890");

        const username = decodedJtw.tokenUsername;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ username }));
    }
    catch (error) {
        console.error('Error:', error);

        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: false, error: error.message }));
    }
}

module.exports = { getUserName, checkUser };
