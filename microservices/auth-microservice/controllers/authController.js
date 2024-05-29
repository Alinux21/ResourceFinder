const User = require('../models/authModel');

async function checkUser(req, res) {
    
        const body = await getPostData(req);
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
            console.error('Error:', error);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: false, error: error.message }));
        }
    });
}

module.exports = { checkUser };
