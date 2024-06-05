const User = require('../models/logModel.js');
const { getPostData } = require('../utils.js')
const jwt = require('jsonwebtoken');

async function setJwt(req, res) {

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



async function createUser(req, res) {
    try {
        const body = await getPostData(req);
        console.log(body);
        const { firstName, lastName, country, city, emailAdress, phoneNumber, userName, password, confirmPassword } = JSON.parse(body);

        console.log(firstName, lastName, country, city, emailAdress, phoneNumber, userName, password, confirmPassword);

        const answear = await User.validateCredentials(firstName, lastName, country, city, emailAdress, phoneNumber, userName, password, confirmPassword);
        if (answear === "Valid credentials") {
            User.createUser(firstName, lastName, country, city, emailAdress, phoneNumber, userName, password);
            const secret = '1234567890';
            const payload = {
                tokenUsername: userName,
                tokenPassword: password
            };
            const token = jwt.sign(payload, secret);


            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: false, error: answear }));

        }
    } catch (error) {
        console.error('Error:', error);

        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: false, error: error.message }));
    }
}

async function accountInfo(req, res) {
    try {
        const jwtVar = req.url.split('/')[4];
        const decodedJtw = jwt.verify(jwtVar, "1234567890");

        const username = decodedJtw.tokenUsername;

        const user = await User.getUser(username);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    }
    catch (error) {
        console.error('Error:', error);

        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: false, error: error.message }));
    }
}

async function updateUser(req, res) {
    try {
        const data = await getPostData(req);
        const { firstName, lastName, country, city, emailAdress, phoneNumber, newPassword, token } = JSON.parse(data);

        const decodedJtw = jwt.verify(token, "1234567890");
        const username = decodedJtw.tokenUsername;

        const user = await User.updateUser(firstName, lastName, country, city, emailAdress, phoneNumber, newPassword, username);
        if (user) {
            const secret = '1234567890';
            const payload = {
                tokenUsername: username,
                tokenPassword: newPassword
            };
            const token = jwt.sign(payload, secret);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: true, token: token }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: false, error: 'User not found' }));
        }
    } catch (error) {
        console.error('Error:', error);

        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: false, error: 'Server error' }));
    }
}

module.exports = { getUserName, setJwt, createUser, accountInfo, updateUser };
