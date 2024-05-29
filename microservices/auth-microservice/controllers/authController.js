const User = require('../models/authModel');

async function checkUser(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        console.log('Received body:', body); // Log the received body for debugging
        try {
            const { username, password } = JSON.parse(body);
            console.log('Parsed body:', { username, password }); // Log parsed body for debugging

            const user = await User.findUser(username, password);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: user ? true : false }));
        } catch (error) {
            console.error('Error:', error);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: false, error: error.message }));
        }
    });
}

module.exports = { checkUser };
