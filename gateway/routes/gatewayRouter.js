const gatewayController = require('../controllers/gatewayController');


const gatewayRouter = (req,res) =>{

    console.log(req.url);

    if(req.url === '/api/resources' && req.method === 'GET'){

        gatewayController.getAllResources(req,res);

    }else if(req.url.match(/\/api\/resources\/([0-9-]+)/) && req.method === 'GET'){

        const id = req.url.split('/')[3];
        gatewayController.getResource(req,res,id);

    }else if(req.url === '/api/resources' && req.method === 'POST'){

        gatewayController.createResource(req,res);

    }else if(req.url.match(/\/api\/resources\/([0-9-]+)/) && req.method === 'PUT'){
    
        const id = req.url.split('/')[3];
        gatewayController.updateResource(req,res,id);


    }else if(req.url.match(/\/api\/resources\/([0-9-]+)/) && req.method === 'DELETE'){
    
        const id = req.url.split('/')[3];
        gatewayController.deleteResource(req,res,id);
        
    }
    else if(req.url.match(/\api\/resources\/images\/([a-zA-Z0-9-_. (){}\[\]!@#$%^&~]+)\.(jpg|jpeg|png|gif)/) && req.method === 'GET'){
        
        const imageName = req.url.split('/')[4];
        gatewayController.getImage(req,res,imageName);

    }else if (req.url.match(/\/api\/resources\/user\/([a-zA-Z0-9-_. (){}\[\]!@#$%^&~]+)/) && req.method === 'GET'){
    
        const username = req.url.split('/')[4];
        gatewayController.getResourcesByUser(req,res,username);

    }
    else if (req.url === '/api/users' && req.method === 'POST'){
    
        gatewayController.setJwt(req,res);
    
    }
    else if (req.url === '/api/users/username' && req.method === 'POST'){
    
        gatewayController.getUsername(req,res);
    
    }else if (req.url === '/api/users/authentification' && req.method === 'POST'){
        
        gatewayController.authentification(req,res);
    } else if (req.url === '/api/users/sign' && req.method === 'POST'){

        gatewayController.createUser(req,res);
    } else if (req.url === '/api/imports' && req.method === 'POST'){
    
        gatewayController.importResources(req,res);

    } else if (req.url.match(/\/api\/words\/([a-zA-Z0-9-_. (){}\[\]!@#$%^&~]+)/) && req.method === 'GET') {
        gatewayController.search(req,res);
    }
    else{
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Api not found' }));
    }    

};

module.exports = gatewayRouter;