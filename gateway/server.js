const { getPostData } = require('./utils.js')
const jwt = require('jsonwebtoken');

const http = require('http');

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

    const parsedUrl = req.url.split('/');

    if (parsedUrl[1] === 'api') {

        if (parsedUrl[2] === 'resources') {
            
            if (req.method === 'GET') {

                console.log(req.url);

                const response = await fetch('http://localhost:5001'+req.url, {   //forwarding the request to the resources api
                    method: req.method,
                    headers: req.headers,
                });

                const responseBody = await response.text();
                
                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(responseBody);

            } else if (req.method === 'POST') {


                const body = await getPostData(req);

                const response = await fetch('http://localhost:5001/api/resources', {   //forwarding the request to the resources api
                    method: req.method,
                    headers: req.headers,
                    body: body
                });


                const responseBody = await response.text();


                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(responseBody);
            }

        }
        else if (parsedUrl[2] === 'users') {


            const body = await getPostData(req);

            const response = await fetch('http://localhost:5002/api/auth', {
                method: req.method,
                headers: req.headers,
                body: body
            });

            const responseBody = await response.text();
            const jwtToken = JSON.parse(responseBody);

            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(jwtToken));
        }

        else if (parsedUrl[2] === 'searches') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Searches api' }));


        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Api not found' }));
        }


    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Api not found' }));
    }
});

server.listen(PORT, () => {

    console.log(`API Gateway running on http://localhost:${PORT}/api`);
});
