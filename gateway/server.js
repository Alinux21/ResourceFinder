const http = require('http');

const PORT = 5010;

const server = http.createServer(async (req, res) => {


    //TODO add verification with JWT for before giving acces to the API's endpoints where needed (e.g. POST in resources)

    const parsedUrl = req.url.split('/');

    if (parsedUrl[1] === 'api') {

        if (parsedUrl[2] === 'resources') {



            const response = await fetch('http://localhost:5001/api/resources', {   //forwarding the request to the resources api
                method: req.method, 
                headers: req.headers 
            });

            const body = await response.text();

            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(body);



        }
        else if (parsedUrl[2] === 'users') {

            const response = await fetch('http://localhost:5002/api/auth', { 
                method: req.method,
                headers: req.headers
            });

            const body = await response.text();

            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(body);
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

    console.log(`Server running on http://localhost:${PORT}/api`);
});
