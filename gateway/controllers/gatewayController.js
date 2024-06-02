const { getPostData } = require('../utils')
const jwt = require('jsonwebtoken');
const http = require('http');

async function getAllResources(req, res) {
    console.log(req.url);

    const response = await fetch('http://localhost:5001/api/resources', {   //forwarding the request to the resources api
        method: req.method,
        headers: req.headers,
    });

    const responseBody = await response.text();

    res.statusCode = response.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(responseBody);
}

async function getResource(req, res, id) {
    console.log(req.url);

    const response = await fetch(`http://localhost:5001/api/resources/${id}`, {   //forwarding the request to the resources api
        method: req.method,
        headers: req.headers,
    });

    const responseBody = await response.text();

    res.statusCode = response.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(responseBody);
}


async function createResource(req, res) {

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

async function getUsername(req, res) {
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

async function createUser(req, res) {
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

async function authentification(req,res){
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
}

async function getImage(req, res, imageName) {
    console.log(req.url);

    const options = {
        hostname: 'localhost',
        port: 5001,
        path: `/api/resources/images/${imageName}`,
        method: req.method,
        headers: req.headers,
    };

    const request = http.request(options, (response) => {
        res.setHeader('Content-Type', 'image/jpg');
        response.pipe(res);
    });

    request.on('error', (error) => {
        console.error(`Problem with request: ${error.message}`);
    });

    request.end();
}


async function getResourcesByUser(req, res, username) {


    const response = await fetch(`http://localhost:5001/api/resources/user/${username}`, {   //forwarding the request to the resources api
        method: req.method,
        headers: req.headers,
    });

    const responseBody = await response.text();

    res.statusCode = response.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(responseBody);


}

async function updateResource(req,res,id){

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

            const response = await fetch('http://localhost:5001/api/resources/'+id, {
                method: 'PUT',
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

module.exports = {
    getAllResources,
    getResource,
    createResource,
    getUsername,
    createUser,
    authentification,
    getImage,
    getResourcesByUser,
    updateResource
};