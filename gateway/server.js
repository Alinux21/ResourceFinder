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

                const response = await fetch('http://localhost:5001' + req.url, {   //forwarding the request to the resources api
                    method: req.method,
                    headers: req.headers,
                });

                const responseBody = await response.text();

                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(responseBody);

            } else if (req.method === 'POST') {

                const multer = require('multer');
                const upload = multer();

                upload.any()(req, res, async (err) => {
                    if (err) {
                        console.error(err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal server error');
                        return;
                    }
            
                    // req.body contains the non-file fields
                    const data = JSON.parse(req.body.data);
                    
                    if (req.files.length > 0) {
                        const file = req.files[0];
                        const formData = new FormData();
                        formData.append('data', JSON.stringify(data));
                        
                        // Create a Blob from the file buffer
                        const blob = new Blob([file.buffer], { type: file.mimetype });
                        formData.append('image', blob, file.originalname);
                
                
                        const response = await fetch('http://localhost:5001/api/resources', {
                            method: 'POST',
                            body: formData
                        });
                
                        const responseText = await response.text();
                        res.end(responseText);
                    } else {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end('No files uploaded');
                    }

                });

            
            }

        }
        else if (parsedUrl[2] === 'users') {

            if (parsedUrl[3] === 'username' && req.method === 'POST') {

                const body = await getPostData(req);

                const response = await fetch('http://localhost:5002/api/log/username', {
                    method: req.method,
                    headers: req.headers,
                    body: body
                });

                if (response.status === 500) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Server error' }));
                } else {

                    const responseBody = await response.text();
                    const jsonResponse = JSON.parse(responseBody);

                    res.statusCode = response.status;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(jsonResponse));
                }

            }



            const body = await getPostData(req);

            const response = await fetch('http://localhost:5002/api/log', {
                method: req.method,
                headers: req.headers,
                body: body
            });

            if (response.status === 404) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
            } else if (response.status === 500) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Server error' }));
            } else {

                const responseBody = await response.text();
                const jwtToken = JSON.parse(responseBody);

                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(jwtToken));
            }
        }

        else if (parsedUrl[2] === 'searches') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Searches api' }));
        }

        else if (parsedUrl[2] === 'authentification') {

            const body = await getPostData(req);

            const response = await fetch('http://localhost:5003/api/auth', {
                method: req.method,
                headers: req.headers,
                body: body
            });

            if (response.status === 404) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
            } else if (response.status === 500) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Server error' }));
            } else {

                const responseBody = await response.text();
                const jsonResponse = JSON.parse(responseBody);

                res.statusCode = response.status;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(jsonResponse));
            }

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
