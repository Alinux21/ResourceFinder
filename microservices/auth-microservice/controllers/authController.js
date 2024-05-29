const User = require('../models/authModel');
const { getPostData } = require('../utils');

async function checkUser(req, res) {
    
        const body = await getPostData(req);
        console.log(body)
        const { username, password } = JSON.parse(body);
        console.log(username, password);
        try {
            const user = await User.checkUser(username, password);
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ admin: true }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ admin: false }));
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ admin: false, error: error.message }));
        }
}

module.exports = {
    checkUser
}